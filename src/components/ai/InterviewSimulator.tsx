'use client';

import { useState, useRef, useEffect } from 'react';
import { useAIStream } from '@/hooks/useAIStream';

type Msg = { role: 'user' | 'assistant'; content: string };

export function InterviewSimulator() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const { state, content, error, stream, reset } = useAIStream();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content, history]);

  const startInterview = async () => {
    setStarted(true);
    reset();
    setHistory([]);
    await stream('/api/interview', { history: [], message: '你好，我们开始面试吧。' });
  };

  const sendReply = async () => {
    if (!input.trim() || state === 'streaming') return;
    const userMsg = input.trim();
    setInput('');
    const newHistory: Msg[] = [...history, { role: 'user', content: userMsg }];
    setHistory(newHistory);
    reset();
    await stream('/api/interview', { history: newHistory, message: userMsg });
  };

  // 把流式内容追加到最后一条 assistant 消息里
  const displayedHistory: Msg[] = [...history];
  if (state === 'streaming' || state === 'done') {
    if (displayedHistory.length > 0 && displayedHistory[displayedHistory.length - 1].role === 'assistant') {
      displayedHistory[displayedHistory.length - 1] = { role: 'assistant', content };
    } else {
      displayedHistory.push({ role: 'assistant', content });
    }
  }

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-accent-200 uppercase tracking-widest">AI · 面试官</span>
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">和 AI 面试官练一场</h3>
      <p className="mt-2 text-sm text-neutral-400">
        DeepSeek 会扮演你面试「产品经理」岗位的考官，根据你的简历提问。多轮对话，能追问。
      </p>

      {!started ? (
        <button
          onClick={startInterview}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-ink-950 px-5 py-2.5 text-sm font-medium hover:bg-accent-200 transition"
        >
          🎯 开始面试
        </button>
      ) : (
        <>
          <div
            ref={scrollRef}
            className="mt-6 max-h-[480px] overflow-y-auto rounded-lg border border-white/5 bg-white/[0.02] p-4 space-y-3"
          >
            {displayedHistory.length === 0 && state === 'loading' && (
              <div className="text-sm text-neutral-500">面试官准备中...</div>
            )}
            {displayedHistory.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-white/[0.06] text-neutral-100'
                      : 'bg-accent-400/[0.08] border border-accent-400/20 text-neutral-100'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
                    {m.role === 'user' ? '你' : '面试官'}
                  </div>
                  {m.content || (state === 'streaming' && i === displayedHistory.length - 1 ? (
                    <span className="inline-block w-1.5 h-3.5 bg-accent-400 animate-pulse" />
                  ) : '')}
                </div>
              </div>
            ))}
            {error && (
              <div className="text-sm text-rose-400 border border-rose-400/20 bg-rose-400/[0.05] rounded-lg p-3">
                出错了：{error}
                <button onClick={() => reset()} className="ml-3 underline">重试</button>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendReply()}
              placeholder="回答面试官的问题..."
              disabled={state === 'loading' || state === 'streaming'}
              className="flex-1 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm focus:border-accent-400/50 focus:outline-none transition disabled:opacity-50"
            />
            <button
              onClick={sendReply}
              disabled={!input.trim() || state === 'streaming'}
              className="rounded-full bg-white text-ink-950 px-5 py-2 text-sm font-medium hover:bg-accent-200 transition disabled:opacity-50"
            >
              发送
            </button>
          </div>
          <div className="mt-3 flex gap-2 text-xs text-neutral-500">
            <button onClick={() => { setStarted(false); reset(); setHistory([]); }} className="hover:text-white">
              重新开始
            </button>
          </div>
        </>
      )}
    </div>
  );
}