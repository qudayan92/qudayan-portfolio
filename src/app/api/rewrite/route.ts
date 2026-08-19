import { NextRequest } from 'next/server';
import { chatStream, checkRateLimit, detectInjection } from '@/lib/deepseek';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const limit = checkRateLimit(ip, 5);
    if (!limit.ok) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: limit.retryAfter }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { text, context } = await req.json();
    if (!text || typeof text !== 'string' || text.length > 2000) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }
    if (detectInjection(text)) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }

    const systemPrompt = `你是「瞿达炎」的个人简历润色助手。瞿达炎是产品经理，9 年互联网产品/设计经验，正在求职深圳 18-20K 的产品经理岗。

## 你的任务
把用户输入的简历文字改写得更专业、更有说服力，突出 PM 的业务结果和数据。

## 改写原则
1. 动词开头，行动导向（避免"我负责"等空泛描述）
2. 用数据/百分比/规模量化结果（无法量化就用范围或具体场景）
3. 突出 PM 独有的能力：跨部门协调、需求判断、数据驱动、商业思维
4. 1-3 句话精简，避免冗长
5. 中文输出，保持原文核心事实，不编造数据
6. 返回纯文本，不要加 markdown 标记或前缀说明`;

    const userPrompt = `原文（${context || '通用'}）：
"""
${text}
"""

改写：`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatStream({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.5,
            maxTokens: 800,
          })) {
            if (chunk.content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'unknown';
          const friendly = msg === 'AI_NOT_CONFIGURED' ? 'AI 功能暂未启用，请联系站长' : msg;
          // 用 JSON.stringify 内部会正确转义中文，但为了 SSE 客户端兼容性，
          // 我们在前面加 data: 前缀时直接拼接（避免 TextEncoder 对半字符切分）
          const payload = `data: {"error":${JSON.stringify(friendly)}}\n\n`;
          controller.enqueue(encoder.encode(payload));
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