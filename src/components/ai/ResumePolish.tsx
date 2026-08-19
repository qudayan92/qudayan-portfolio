'use client';

import { useState } from 'react';
import { useAIStream } from '@/hooks/useAIStream';

type Example = { label: string; text: string };

const EXAMPLES: Example[] = [
  {
    label: '工作经历',
    text: '负责智能家居安全系统的竞品分析，进行需求调研，明确软硬件的功能定义。',
  },
  {
    label: '项目业绩',
    text: '智能家居安全系统获得行业奖项，销售额增长20%。',
  },
  {
    label: '个人优势',
    text: '擅长通过数据分析和用户反馈，发现问题和优化机会，指导产品决策和迭代优化。',
  },
];

export function ResumePolish() {
  const [text, setText] = useState(EXAMPLES[0].text);
  const { state, content, error, stream, reset } = useAIStream();

  const handleRewrite = () => {
    if (!text.trim()) return;
    stream('/api/rewrite', { text, context: '简历文字' });
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-accent-200 uppercase tracking-widest">AI · 简历润色</span>
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">
        让 AI 现场改写简历
      </h3>
      <p className="mt-2 text-sm text-neutral-400">
        粘贴你的简历文字，DeepSeek 会改写得更专业、更有说服力。流式输出，能看到 AI 打字。
      </p>

      {/* 标签选择 */}
      <div className="mt-5 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => {
              setText(ex.text);
              reset();
            }}
            className={`text-xs rounded-full border px-3 py-1 transition ${
              text === ex.text
                ? 'border-accent-400/40 bg-accent-400/10 text-accent-200'
                : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:border-white/30'
            }`}
          >
            试：{ex.label}
          </button>
        ))}
      </div>

      {/* 输入 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="mt-4 w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-neutral-200 placeholder-neutral-600 focus:border-accent-400/50 focus:outline-none transition resize-none"
        placeholder="粘贴你想优化的简历文字..."
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleRewrite}
          disabled={state === 'loading' || state === 'streaming' || !text.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-white text-ink-950 px-5 py-2 text-sm font-medium hover:bg-accent-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'loading' || state === 'streaming' ? '生成中...' : '✨ 润色'}
        </button>
        {(state === 'done' || state === 'error') && (
          <button onClick={reset} className="text-sm text-neutral-500 hover:text-white">
            清空
          </button>
        )}
      </div>

      {/* 结果对比 */}
      {(state === 'streaming' || state === 'done' || state === 'error') && (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="text-xs text-neutral-500 mb-2">原文</div>
            <p className="text-sm text-neutral-400 leading-relaxed">{text}</p>
          </div>
          <div className="rounded-lg border border-accent-400/20 bg-accent-400/[0.04] p-4">
            <div className="text-xs text-accent-200 mb-2 flex items-center gap-1.5">
              AI 润色
              {state === 'streaming' && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-dot" />
              )}
            </div>
            {error ? (
              <p className="text-sm text-rose-400">{error}</p>
            ) : (
              <p className="text-sm text-neutral-100 leading-relaxed whitespace-pre-wrap">
                {content}
                {state === 'streaming' && <span className="inline-block w-1.5 h-3.5 bg-accent-400 ml-0.5 animate-pulse" />}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}