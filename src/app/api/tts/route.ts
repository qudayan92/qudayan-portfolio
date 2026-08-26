import { NextRequest } from 'next/server';
import { EdgeTTS } from 'edge-tts-universal';

// 必须用 Node.js 运行时（Edge TTS 依赖 WebSocket 与原生 Web API）
export const runtime = 'nodejs';

// 音色偏好：优先用晓晓（Xiaoxiao，自然、温暖、可带情感）；可用环境变量覆盖
const DEFAULT_VOICE = process.env.TTS_VOICE || 'zh-CN-XiaoxiaoNeural';
const MAX_TEXT = 500; // 单次合成的最大字符数，防止滥用

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export async function POST(req: NextRequest) {
  try {
    const { text, voice } = await req.json();
    if (!text || typeof text !== 'string') {
      return json({ error: 'invalid_input' }, 400);
    }

    const clean = text.trim().slice(0, MAX_TEXT);
    if (!clean) {
      return json({ error: 'invalid_input' }, 400);
    }

    const tts = new EdgeTTS(clean, typeof voice === 'string' && voice ? voice : DEFAULT_VOICE, {
      rate: '+0%',
      pitch: '+1Hz',
      volume: '+0%',
    });
    const result = await tts.synthesize();
    const audio = Buffer.from(await result.audio.arrayBuffer());

    return new Response(new Uint8Array(audio), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return json({ error: 'tts_failed', message }, 502);
  }
}
