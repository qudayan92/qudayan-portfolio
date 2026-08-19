'use client';

import { useState } from 'react';

type Idea = {
  title: string;
  angle: string;
  hook: string;
  category: string;
};

const categoryColor: Record<string, string> = {
  '产品方法论': 'bg-violet-400/20 text-violet-200 border-violet-400/30',
  '智能家居': 'bg-amber-400/20 text-amber-200 border-amber-400/30',
  'AIGC': 'bg-accent-400/20 text-accent-200 border-accent-400/30',
  '职业': 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30',
  '设计': 'bg-rose-400/20 text-rose-200 border-rose-400/30',
};

export function BlogIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setIdeas(data.ideas || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const isUnavailable = error?.includes('AI 功能暂未启用');

  return (
    <div className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-accent-200 uppercase tracking-widest">AI · 选题</span>
      </div>
      <h3 className="text-2xl font-semibold tracking-tight">让 AI 推荐下一波博客选题</h3>
      <p className="mt-2 text-sm text-neutral-400">
        根据你已有的博客 + 简历背景，DeepSeek 会输出 5 个具体、有钩子的选题草稿。
      </p>

      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-white text-ink-950 px-5 py-2 text-sm font-medium hover:bg-accent-200 transition disabled:opacity-50"
        >
          {loading ? '生成中...' : '💡 生成选题'}
        </button>
        {ideas.length > 0 && (
          <button onClick={generate} disabled={loading} className="text-sm text-neutral-500 hover:text-white">
            再来一组
          </button>
        )}
      </div>

      {error && (
        <div className={`mt-4 rounded-lg border p-4 text-sm ${
          isUnavailable
            ? 'border-amber-400/30 bg-amber-400/[0.04] text-amber-200'
            : 'border-rose-400/30 bg-rose-400/[0.04] text-rose-300'
        }`}>
          <div className="font-medium mb-1">
            {isUnavailable ? '⏸ AI 暂未启用' : '✗ 出错了'}
          </div>
          <p className="text-xs opacity-90">{error}</p>
        </div>
      )}

      {ideas.length > 0 && (
        <div className="mt-6 space-y-3">
          {ideas.map((idea, i) => (
            <article
              key={i}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-accent-400/30 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-base font-medium text-white flex-1">
                  {idea.title}
                </h4>
                <span
                  className={`flex-none text-[10px] uppercase tracking-widest rounded-full border px-2 py-0.5 ${
                    categoryColor[idea.category] || 'border-white/10 bg-white/5 text-neutral-400'
                  }`}
                >
                  {idea.category}
                </span>
              </div>
              <p className="mt-2 text-sm text-neutral-300">
                <span className="text-neutral-500">角度：</span>
                {idea.angle}
              </p>
              {idea.hook && (
                <p className="mt-2 text-sm text-neutral-400 italic border-l-2 border-accent-400/40 pl-3">
                  {idea.hook}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}