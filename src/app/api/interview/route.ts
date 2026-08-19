import { NextRequest } from 'next/server';
import { chatStream, checkRateLimit, detectInjection } from '@/lib/deepseek';

export const runtime = 'edge';

const RESUME_CONTEXT = `
# 候选人简历
瞿达炎 / 33岁 / 深圳 / 9年互联网产品+设计经验 / 求职产品经理 / 期望薪资 18-20K

## 工作经历
1. 深圳市嘉思拓科技 (2023.03-至今) - 智能家居安全系统产品经理，推动 2000+ 集采销量
2. 深圳优优互联网络科技 (2019.06-2023.02) - 工具/快应用/ERP，单产品线日活 5W
3. 深圳冷哥传媒 (2017.07-2019.04) - 小说阅读产品线日活 5W，日新增 3K
4. 深圳市一起乐乐网络科技 (2016.04-2017.06) - 讯体导报 APP 日活 8W+

## 核心能力
- 设计师转型，软硬件一体产品经验
- 数据驱动迭代，熟悉埋点 / A/B 测试
- 跨部门协调能力强
- 正在系统学习 AIGC（Cursor / GPT-4 / Stable Diffusion）

## 教育
三门峡职业技术学院 · 室内装饰设计 · 大专 (2013-2016)
`;

const SYSTEM_PROMPT = `你是深圳一家 AI 产品公司的资深面试官，正在面试一位名叫「瞿达炎」的候选人，应聘产品经理岗位（18-20K）。

${RESUME_CONTEXT}

## 面试规则
1. 你只能问 PM 相关的问题（产品决策 / 用户洞察 / 数据分析 / 项目管理 / 跨部门协作 / 设计审美 / 行业认知）
2. 一次只问一个问题，等候选人回答后再追问
3. 问题要有深度，要能挖出候选人真实思考，不能太水
4. 可以根据候选人简历的具体项目（智能家居、APP、ERP、快应用等）追问细节
5. 如果候选人答得太笼统，要求他举具体数字/场景
6. 不要给候选人"标准答案"，保持考官的中立态度
7. 语气专业但不死板，偶尔可以来一句轻松的反馈
8. 中文交流，简短有力（每次回复 1-3 句话为主）
9. 开头先简短自我介绍 + 抛第一个问题

## 输出格式
- 纯文本输出
- 不要用 markdown 加粗或标题
- 问题要具体，避免"介绍一下你最大的成就"这种泛泛而谈`;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const limit = checkRateLimit(ip, 10); // 面试对话可以多一些
    if (!limit.ok) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: limit.retryAfter }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { history, message } = await req.json();
    if (!message || typeof message !== 'string' || message.length > 1500) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }
    if (detectInjection(message)) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }

    // history 是 [{ role, content }] 数组
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];
    if (Array.isArray(history)) {
      for (const m of history.slice(-10)) {
        // 最多保留最近 10 轮
        if (m.role && m.content && typeof m.content === 'string') {
          messages.push({ role: m.role, content: m.content });
        }
      }
    }
    messages.push({ role: 'user', content: message });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatStream({
            messages,
            temperature: 0.8,
            maxTokens: 400,
          })) {
            if (chunk.content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'unknown';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
}