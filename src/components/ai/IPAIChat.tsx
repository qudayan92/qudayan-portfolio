'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X, Send, Sparkles, GripHorizontal } from 'lucide-react';
import { ip } from '@/lib/profile';

type Msg = { id: string; role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  '你能介绍一下自己吗？',
  '你做过哪些有代表性的项目？',
  '你擅长什么技能？',
  '为什么从设计师转做产品经理？',
];

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function IPAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'streaming' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(true);
  const bodyRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // 拖拽约束容器（整个视口），让面板在松手后保持在屏幕内
  const dragRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 首次打开时给一条欢迎语，建立情绪价值
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          id: uid(),
          role: 'assistant',
          content:
            '嗨，我是瞿达炎的 AI 数字分身 👋 关于他的项目、经历、技能，或者你自己在做产品时的小困惑，都可以问我。我随时在这儿，陪你聊～',
        },
      ]);
    }
  }, [open, messages.length]);

  // 滚到底部
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, state]);

  // 关闭时清空未读标记
  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = (text ?? '').trim();
    if (!trimmed || state === 'loading' || state === 'streaming') return;

    const userMsg: Msg = { id: uid(), role: 'user', content: trimmed };
    const assistantMsg: Msg = { id: uid(), role: 'assistant', content: '' };
    // 取 history（排除占位 assistant 空消息）
    const history = [...messages, userMsg]
      .filter((m) => m.content)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setState('loading');
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/ip-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => ({}));
        setError(`说得太快啦，请 ${data.retryAfter || 60} 秒后再找我聊～`);
        setState('error');
        return;
      }
      if (response.status === 503) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'AI 还没接入，稍后再来～');
        setState('error');
        return;
      }
      if (!response.ok || !response.body) throw new Error('请求失败');

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
          const t = line.trim();
          if (!t || !t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (data === '[DONE]') {
            setState('idle');
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
              // 逐字更新
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: accumulated } : m))
              );
            }
          } catch {
            // ignore
          }
        }
      }
      setState('idle');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      // 若是助手还没输出，给它一个兜底文案
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: m.content || '哎呀，我这会儿有点卡。你别急，再发我一次，我一定好好回你～' }
            : m
        )
      );
      setState('idle');
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setState('idle');
    setError(null);
  };

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="与 AI 数字分身对话"
        className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-violet-600 text-white shadow-2xl shadow-violet-500/40 transition hover:scale-105"
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative flex items-center justify-center">
            <img src={ip.portrait} alt="" className="h-14 w-14 rounded-full object-cover ring-2 ring-white/40" />
            {unread && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 text-[9px] font-bold text-ink-950">
                  1
                </span>
              </span>
            )}
          </div>
        )}
      </button>

      {/* 聊天面板（可拖拽） */}
      {open && (
        <div ref={dragRef} className="pointer-events-none fixed inset-0 z-50">
          <motion.div
            drag={reduce ? false : true}
            dragConstraints={dragRef}
            dragMomentum={false}
            dragElastic={0.12}
            dragTransition={{ bounceStiffness: 400, bounceDamping: 30 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto absolute bottom-24 right-5 flex h-[34rem] max-h-[80vh] w-[24rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            {/* 头部（拖拽手柄） */}
            <div
              className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-ink-800/80 to-ink-700/80 px-4 py-3"
              style={{ touchAction: reduce ? 'auto' : 'none', cursor: reduce ? 'default' : 'grab' }}
            >
              <div className="relative">
                <img src={ip.portrait} alt="IP 分身" className="h-10 w-10 rounded-full object-cover ring-2 ring-accent-400/60" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-ink-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
                  瞿达炎 · AI 数字分身
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                </div>
                <div className="text-xs text-emerald-300/80">在线 · 陪你聊</div>
              </div>
              <span className="mr-1 flex items-center gap-1 text-[10px] text-neutral-500">
                <GripHorizontal className="h-3.5 w-3.5" />
                拖动
              </span>
              <button onClick={reset} className="rounded-lg px-2 py-1 text-xs text-neutral-400 hover:bg-white/5 hover:text-white">
                清空
              </button>
            </div>

            {/* 消息区 */}
            <div ref={bodyRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-br-sm bg-gradient-to-br from-accent-500/90 to-violet-500/90 text-white'
                        : 'rounded-bl-sm border border-white/10 bg-white/[0.04] text-neutral-100'
                    }`}
                  >
                    {m.content}
                    {m.id === messages[messages.length - 1]?.id && state === 'streaming' && (
                      <span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-accent-400 align-middle" />
                    )}
                  </div>
                </div>
              ))}

              {state === 'loading' && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-neutral-400">
                    正在思考…
                  </div>
                </div>
              )}

              {error && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm border border-rose-400/30 bg-rose-400/[0.08] px-3.5 py-2.5 text-sm text-rose-300">
                    {error}
                  </div>
                </div>
              )}
            </div>

            {/* 快捷提问 */}
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  disabled={state === 'loading' || state === 'streaming'}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-300 hover:border-accent-400/40 hover:text-white disabled:opacity-40"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* 输入区 */}
            <div className="flex items-center gap-2 border-t border-white/10 p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="问点关于作品集的，或随便聊聊…"
                className="flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-neutral-100 placeholder-neutral-600 focus:border-accent-400/50 focus:outline-none"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || state === 'loading' || state === 'streaming'}
                className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-violet-600 text-white transition hover:scale-105 disabled:opacity-40"
                aria-label="发送"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
