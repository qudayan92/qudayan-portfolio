'use client';

import { useState, useCallback } from 'react';

export type StreamState = 'idle' | 'loading' | 'streaming' | 'done' | 'error';

export function useAIStream() {
  const [state, setState] = useState<StreamState>('idle');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const stream = useCallback(async (url: string, body: unknown) => {
    setState('loading');
    setContent('');
    setError(null);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        setError(`请求太频繁，请 ${data.retryAfter || 60} 秒后再试`);
        setState('error');
        return;
      }
      if (!response.ok || !response.body) {
        throw new Error(`请求失败 (${response.status})`);
      }

      setState('streaming');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') {
            setState('done');
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.error) {
              setError(parsed.error);
              setState('error');
              return;
            }
            if (parsed.content) {
              accumulated += parsed.content;
              setContent(accumulated);
            }
          } catch {
            // ignore
          }
        }
      }
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
      setState('error');
    }
  }, []);

  const reset = useCallback(() => {
    setState('idle');
    setContent('');
    setError(null);
  }, []);

  return { state, content, error, stream, reset };
}