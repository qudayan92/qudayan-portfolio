import { NextRequest } from 'next/server';
import { chatStream, checkRateLimit, detectInjection } from '@/lib/deepseek';
import { buildIpPersona } from '@/lib/persona';

export const runtime = 'nodejs';

type Msg = { role: 'user' | 'assistant'; content: string };

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    // 多轮对话，放宽限频
    const limit = checkRateLimit(ip, 12);
    if (!limit.ok) {
      return new Response(JSON.stringify({ error: 'rate_limited', retryAfter: limit.retryAfter }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { message, history } = await req.json();
    if (!message || typeof message !== 'string' || message.length > 1000) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }
    if (detectInjection(message)) {
      return new Response(JSON.stringify({ error: 'invalid_input' }), { status: 400 });
    }

    // 校验 history，最多取最近 10 轮，防止上下文爆炸
    let historyMsgs: Msg[] = [];
    if (Array.isArray(history)) {
      historyMsgs = history
        .filter(
          (m): m is Msg =>
            !!m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string' &&
            m.content.length <= 2000
        )
        .slice(-10);
    }

    const encoder = new TextEncoder();
    const systemPrompt = buildIpPersona();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          let yielded = false;
          for await (const chunk of chatStream({
            messages: [
              { role: 'system', content: systemPrompt },
              ...historyMsgs.map((m) => ({ role: m.role, content: m.content })),
              { role: 'user', content: message },
            ],
            temperature: 0.8,
            maxTokens: 1200,
          })) {
            if (chunk.content) {
              yielded = true;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk.content })}\n\n`));
            }
          }
          if (!yielded) {
            // API 通了但没产出内容：给一个友好兜底
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: '嗯……我刚刚走神了，能再跟我说一遍吗？我听着呢。' })}\n\n`)
            );
          }
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'unknown';
          const friendly = msg === 'AI_NOT_CONFIGURED' ? '我暂时还没连上大脑（AI 未启用），请联系站长配置哦～' : msg;
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
  } catch {
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
}
