import { NextRequest } from 'next/server';
import { EdgeTTS } from 'edge-tts-universal';

// 必须用 Node.js 运行时（Edge TTS 依赖 WebSocket 与原生 Web API）
export const runtime = 'nodejs';

// 音色偏好：男声默认云希（Yunxi，温和睿智）；可用环境变量覆盖，如 TTS_VOICE=zh-CN-YunjianNeural
const DEFAULT_VOICE = process.env.TTS_VOICE || 'zh-CN-YunxiNeural';
const MAX_TEXT = 600; // 单次合成最大字符数，防止滥用
const MAX_CACHE = 100;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

const audioHeaders = (key: string) => ({
  'Content-Type': 'audio/mpeg',
  // 问候语是固定内容，客户端可缓存一天
  'Cache-Control': key.includes('|greeting|') ? 'public, max-age=86400' : 'public, max-age=3600',
});

// 内存缓存：相同的 text+voice 只合成一次，重复访问秒回（按服务器实例生效）
const cache = new Map<string, Buffer>();

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

    const chosen = typeof voice === 'string' && voice ? voice : DEFAULT_VOICE;
    const key = `${chosen}|${clean}`;

    const cached = cache.get(key);
    if (cached) {
      return new Response(new Uint8Array(cached), { headers: audioHeaders(key) });
    }

    const tts = new EdgeTTS(clean, chosen, {
      rate: '+0%',
      pitch: '+0Hz',
      volume: '+0%',
    });
    const result = await tts.synthesize();
    const audio = Buffer.from(await result.audio.arrayBuffer());

    if (cache.size >= MAX_CACHE) cache.clear();
    cache.set(key, audio);

    return new Response(new Uint8Array(audio), { headers: audioHeaders(key) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown';
    return json({ error: 'tts_failed', message }, 502);
  }
}
