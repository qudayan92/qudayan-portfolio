import { projects } from '@/lib/profile';

const categoryColor: Record<string, string> = {
  '硬件': 'from-amber-400/30 to-orange-500/30 text-amber-200',
  'APP': 'from-accent-400/30 to-cyan-500/30 text-accent-200',
  '快应用': 'from-emerald-400/30 to-teal-500/30 text-emerald-200',
  '后台系统': 'from-violet-400/30 to-fuchsia-500/30 text-violet-200',
  '内容': 'from-rose-400/30 to-pink-500/30 text-rose-200',
};

export function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">Projects · 项目集</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              做过的一些<span className="text-gradient">代表作</span>。
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <article
              key={p.name}
              className="glass rounded-2xl p-6 flex flex-col group"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full bg-gradient-to-r ${categoryColor[p.category] || 'from-white/10 to-white/5 text-neutral-300'} px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider`}
                >
                  {p.category}
                </span>
                <span className="font-mono text-[11px] text-neutral-500">
                  {p.period}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-medium text-white group-hover:text-accent-200 transition-colors">
                {p.name}
              </h3>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                {p.summary}
              </p>

              <ul className="mt-4 space-y-1.5 text-sm text-neutral-300 flex-1">
                {p.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-neutral-600">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              {p.metrics.length > 0 && (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  {p.metrics.map((m) => (
                    <div
                      key={m}
                      className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1 text-[11px] text-neutral-300"
                    >
                      {m}
                    </div>
                  ))}
                </div>
              )}

              {p.stack && p.stack.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-white/[0.03] px-2 py-0.5 text-[10px] text-neutral-500"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}