import { me, education } from '@/lib/profile';

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="eyebrow">About · 关于我</p>
        <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
          设计师的眼睛，<span className="text-gradient">产品的脑子</span>。
        </h2>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 glass rounded-2xl p-6 md:p-8">
            <p className="text-neutral-300 leading-relaxed text-[15px] md:text-base">
              {me.about}
            </p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-lg border border-white/5 p-4">
                <div className="text-neutral-500 text-xs mb-1">求职意向</div>
                <div className="text-white font-medium">{me.target.role}</div>
              </div>
              <div className="rounded-lg border border-white/5 p-4">
                <div className="text-neutral-500 text-xs mb-1">期望城市</div>
                <div className="text-white font-medium">{me.target.city}</div>
              </div>
              <div className="rounded-lg border border-white/5 p-4">
                <div className="text-neutral-500 text-xs mb-1">期望薪资</div>
                <div className="text-white font-medium">{me.target.salary}</div>
              </div>
            </div>
          </div>

          <aside className="glass rounded-2xl p-6 md:p-8">
            <p className="eyebrow">Education · 教育</p>
            <h3 className="mt-3 text-lg font-medium text-white">
              {education.school}
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              {education.major} · {education.degree} · {education.period}
            </p>
            <p className="mt-4 text-sm text-neutral-300 leading-relaxed">
              {education.highlight}
            </p>

            <p className="eyebrow mt-8">Currently · 在学什么</p>
            <ul className="mt-3 space-y-2 text-sm text-neutral-300">
              <li className="flex gap-2">
                <span className="text-accent-400">▸</span>
                Prompt Engineering / Cursor / Devin
              </li>
              <li className="flex gap-2">
                <span className="text-accent-400">▸</span>
                LLM 自动化 PRD / 用户调研报告
              </li>
              <li className="flex gap-2">
                <span className="text-accent-400">▸</span>
                Stable Diffusion UI 概念图工作流
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}