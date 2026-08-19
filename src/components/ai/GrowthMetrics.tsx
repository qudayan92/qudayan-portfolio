import { getSiteStats } from '@/lib/blog';

export function GrowthMetrics() {
  const stats = getSiteStats();

  // 启动日期：项目第一次 commit (2026-08-19)
  const startDate = new Date('2026-08-19');
  const totalDays = Math.max(0, Math.floor((Date.now() - startDate.getTime()) / 86400000));

  const items = [
    { k: stats.postCount.toString(), v: '篇博客', sub: '已发布' },
    { k: (stats.charCount / 1000).toFixed(1) + 'k', v: '总字数', sub: '中文 + 代码' },
    { k: stats.daysRunning + '天', v: '首篇博客后', sub: '持续输出' },
    { k: totalDays + '天', v: '网站运行', sub: '自 Vercel 部署起' },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-mono text-accent-200 uppercase tracking-widest">
          Growth · 自生长指标
        </span>
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
      </div>
      <h3 className="mt-2 text-lg font-medium text-white">这个网站的数据</h3>
      <p className="mt-1 text-xs text-neutral-500">
        每次 commit 都自动重新部署；每次新博客都会被 AI 摘要（启用后）。
      </p>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => (
          <div
            key={it.v}
            className="rounded-xl border border-white/5 bg-white/[0.02] p-3"
          >
            <div className="text-2xl font-display font-semibold text-white tabular-nums">
              {it.k}
            </div>
            <div className="mt-1 text-xs text-neutral-300">{it.v}</div>
            <div className="text-[10px] text-neutral-500 mt-0.5">{it.sub}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-[10px] text-neutral-600 font-mono">
        tags: {stats.tagSet.join(' · ')}
      </div>
    </div>
  );
}