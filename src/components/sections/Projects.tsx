import { projects } from '@/lib/profile';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const categoryStyle: Record<
  string,
  { badge: string; cover: string; glow: string; icon: 'hardware' | 'app' | 'quick' | 'admin' | 'content' }
> = {
  '硬件': { badge: 'from-amber-400/30 to-orange-500/30 text-amber-200', cover: 'from-amber-500/30 via-orange-500/15 to-transparent', glow: 'bg-amber-400', icon: 'hardware' },
  'APP': { badge: 'from-accent-400/30 to-cyan-500/30 text-accent-200', cover: 'from-accent-400/30 via-cyan-500/15 to-transparent', glow: 'bg-accent-400', icon: 'app' },
  '快应用': { badge: 'from-emerald-400/30 to-teal-500/30 text-emerald-200', cover: 'from-emerald-400/30 via-teal-500/15 to-transparent', glow: 'bg-emerald-400', icon: 'quick' },
  '后台系统': { badge: 'from-violet-400/30 to-fuchsia-500/30 text-violet-200', cover: 'from-violet-500/30 via-fuchsia-500/15 to-transparent', glow: 'bg-violet-400', icon: 'admin' },
  '内容': { badge: 'from-rose-400/30 to-pink-500/30 text-rose-200', cover: 'from-rose-500/30 via-pink-500/15 to-transparent', glow: 'bg-rose-400', icon: 'content' },
};

function CategoryIcon({ kind, className }: { kind: string; className?: string }) {
  const cls = className || 'h-5 w-5';
  switch (kind) {
    case 'hardware': return <span className={`${cls} inline-block`}>▣</span>;
    case 'app': return <span className={`${cls} inline-block`}>◉</span>;
    case 'quick': return <span className={`${cls} inline-block`}>⚡</span>;
    case 'admin': return <span className={`${cls} inline-block`}>▤</span>;
    case 'content': return <span className={`${cls} inline-block`}>▦</span>;
    default: return <span className={`${cls} inline-block`}>◆</span>;
  }
}

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

        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => {
            const cat = categoryStyle[p.category] || categoryStyle['内容'];
            return (
              <StaggerItem key={p.name}>
                <article className="glass rounded-2xl overflow-hidden flex flex-col group h-full">
                  {/* 视觉封面 */}
                  <div className={`relative h-24 bg-gradient-to-br ${cat.cover}`}>
                    <div className="absolute inset-0 grid-bg opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-ink-900/70 text-white shadow-lg backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                        <CategoryIcon kind={cat.icon} />
                      </div>
                    </div>
                    <span className={`absolute left-3 top-3 rounded-full bg-gradient-to-r ${cat.badge} px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider`}>
                      {p.category}
                    </span>
                    <span className="absolute right-3 top-3 font-mono text-[11px] text-neutral-400">
                      {p.period}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-medium text-white group-hover:text-accent-200 transition-colors">
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
                  </div>
                </article>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
