import { NextRequest } from 'next/server';
import { chat, checkRateLimit, detectInjection } from '@/lib/deepseek';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `你是「瞿达炎」的个人助理，帮访问者起草一段破冰/自我介绍消息，用来发给瞿达炎。

## 瞿达炎背景
- 深圳产品经理，9 年互联网经验
- 擅长：智能家居 IoT、APP/快应用、ERP、广告变现、AIGC
- 求职意向：深圳产品经理，期望 18-20K

## 你的任务
访问者填了一段「我是谁 + 我为什么联系你」的内容。你要帮他润色成一段简洁专业的破冰消息（3-5 句话），让人一眼 get 到：
- 对方是谁
- 为啥找你
- 期待什么（合作 / 面试 / 咨询）

## 输出
- 中文
- 60-150 字
- 专业但不死板
- 直接是消息正文，不要加"这是为您生成的消息："这种前缀`;

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

    const { name, role, reason } = await req.json();
    if (!reason || typeof reason !== 'string' || reason.length > 1000) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }
    if (detectInjection(reason)) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }

    const userPrompt = `访问者信息：
姓名：${name || '未填写'}
身份：${role || '未填写'}
联系原因：${reason}

请起草破冰消息：`;

    const result = await chat({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      maxTokens: 800,
    });

    return Response.json({ message: result.trim() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (msg === 'AI_NOT_CONFIGURED') {
      return Response.json(
        { error: 'AI 功能暂未启用，请联系站长配置 API Key 后再试' },
        { status: 503 }
      );
    }
    return Response.json({ error: '服务暂时不可用，请稍后重试' }, { status: 500 });
  }
}