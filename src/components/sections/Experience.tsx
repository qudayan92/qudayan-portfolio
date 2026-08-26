import { experiences } from '@/lib/profile';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { ShinyText } from '@/components/motion/ShinyText';

export function Experience() {
  return (
    <section id="experience" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">Experience · 工作经历</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              一路从<ShinyText text="设计师" color="#c4b5fd" shineColor="#f0abfc" spread={130} speed={3} />走到产品。
            </h2>
          </div>
          <p className="hidden md:block text-sm text-neutral-500 max-w-xs text-right">
            最近 4 家公司，主导或参与 6+ 条产品线。
          </p>
        </Reveal>

        <Stagger className="relative border-l border-white/10 pl-6 space-y-10">
          {experiences.map((exp) => (
            <StaggerItem key={exp.company + exp.period} className="relative">
              <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full bg-gradient-to-br from-accent-400 to-violet-500 ring-4 ring-ink-950" />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg md:text-xl font-medium text-white">
                  {exp.role} · {exp.company}
                </h3>
                <span className="font-mono text-xs text-neutral-500">
                  {exp.period}
                </span>
              </div>
              {exp.highlight && (
                <p className="mt-2 text-sm text-accent-200">
                  ★ {exp.highlight}
                </p>
              )}
              <ul className="mt-4 space-y-2 text-[15px] text-neutral-300">
                {exp.bullets.map((b, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-neutral-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              {exp.tags && exp.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-0.5 text-xs text-neutral-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
