// LLM API 客户端封装（OpenAI 兼容协议）
// 默认接入 Agnes AI，可通过环境变量切换到任意 OpenAI 兼容平台：
//   LLM_API_BASE_URL   - 默认 https://apihub.agnes-ai.com/v1
//   LLM_API_KEY        - 默认读 DEEPSEEK_API_KEY（向后兼容）
//   LLM_MODEL          - 默认 agnes-2.5-flash
// API_KEY 只在服务端使用（never exposed to client）

const LLM_API_BASE_URL =
  process.env.LLM_API_BASE_URL || 'https://apihub.agnes-ai.com/v1';
const LLM_API_URL = `${LLM_API_BASE_URL.replace(/\/$/, '')}/chat/completions`;
const LLM_MODEL = process.env.LLM_MODEL || 'agnes-2.5-flash';

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatOptions = {
  messages: ChatMessage[];
  temperature?: number; // 0-1, default 0.7
  maxTokens?: number; // default 1024
  stream?: boolean; // default true
};

export type ChatChunk = {
  content: string;
  finishReason?: 'stop' | 'length' | 'content_filter';
};

function getApiKey(): string {
  const key = process.env.LLM_API_KEY || process.env.DEEPSEEK_API_KEY;
  if (!key) {
    throw new Error('AI_NOT_CONFIGURED');
  }
  return key;
}

// 非流式调用
export async function chat(options: ChatOptions): Promise<string> {
  const { messages, temperature = 0.7, maxTokens = 1024 } = options;
  const response = await fetch(LLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// 流式调用 - 返回一个 async generator
export async function* chatStream(options: ChatOptions): AsyncGenerator<ChatChunk, void, void> {
  const { messages, temperature = 0.7, maxTokens = 1024 } = options;
  const response = await fetch(LLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => 'unknown');
    throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE 格式：data: {...}\n\n
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data:')) continue;
      const data = trimmed.slice(5).trim();
      if (data === '[DONE]') {
        return;
      }
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        const finishReason = parsed.choices?.[0]?.finish_reason;
        if (delta) {
          yield { content: delta, finishReason: finishReason || undefined };
        } else if (finishReason) {
          yield { content: '', finishReason };
        }
      } catch {
        // 忽略解析失败的行
      }
    }
  }
}

// 简易 rate limiter (in-memory, per-IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  ip: string,
  maxPerMinute = 5
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return { ok: true };
  }
  if (entry.count >= maxPerMinute) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { ok: true };
}

// 检测明显的 prompt injection 尝试
export function detectInjection(input: string): boolean {
  const suspicious = [
    /ignore\s+(previous|above)\s+instructions?/i,
    /system\s*:/i,
    /你是.*助手/i,
    /<\|.*?\|>/, // 特殊 token
    /\bDAN\b/, // 越狱尝试
  ];
  return suspicious.some((re) => re.test(input));
}