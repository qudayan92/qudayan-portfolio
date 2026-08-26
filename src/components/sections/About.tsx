import { me, education } from '@/lib/profile';
import { Reveal } from '@/components/motion/Reveal';
import { ShinyText } from '@/components/motion/ShinyText';
import { Sparkles } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="eyebrow">About · 关于我</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
            设计师的眼睛，<ShinyText text="产品的脑子" color="#c4b5fd" shineColor="#f0abfc" spread={130} speed={3} />
            。
          </h2>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <Reveal delay={0.05} className="md:col-span-2">
            <div className="glass rounded-2xl p-6 md:p-8 h-full">
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
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="glass rounded-2xl p-6 md:p-8 h-full flex flex-col relative overflow-hidden">
              {/* 角落氛围光 */}
              <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-violet-500/20 blur-2xl" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-accent-400 to-violet-500 opacity-40 blur-md" />
                  <img
                    src="/avatar.webp"
                    alt="瞿达炎"
                    className="relative h-20 w-20 rounded-2xl ring-1 ring-white/10"
                  />
                </div>
                <div>
                  <div className="text-lg font-medium text-white">瞿达炎</div>
                  <div className="text-xs text-neutral-500 mt-0.5">PM · 深圳</div>
                </div>
              </div>

              <p className="eyebrow mt-8">Education · 教育</p>
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
              <ul className="mt-3 space-y-2 text-sm text-neutral-300 flex-1">
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

              <div className="mt-8 flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                在职 · 一个月内可到岗
              </div>
            </aside>
          </Reveal>
        </div>

        {/* IP 形象情绪横幅 */}
        <Reveal delay={0.15}>
          <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10">
            <div className="absolute inset-0" style={{ backgroundImage: 'url(/bg-ambient.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className="absolute inset-0 bg-ink-950/60" />
            <div className="relative grid md:grid-cols-[1.2fr_1fr] gap-6 p-8 md:p-12 items-center">
              <div>
                <p className="eyebrow flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent-200" />
                  My IP · 我的数字分身
                </p>
                <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-white">
                  一个<span className="text-gradient">懂设计的产品经理</span>。
                </h3>
                <p className="mt-4 max-w-xl text-neutral-300 leading-relaxed">
                  从室内设计到 UI/交互，再到产品经理，我始终相信好的产品要有「温度」。
                  这个 3D 形象就是我想传达给你的感觉——专业、真诚、对细节较真。
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['设计感', '数据驱动', 'AIGC', '重落地'].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent-400/30 to-violet-500/30 blur-xl" />
                  <img
                    src="/ip-pm.webp"
                    alt="瞿达炎 3D IP 形象"
                    className="relative h-56 w-56 md:h-64 md:w-64 object-cover rounded-2xl ring-1 ring-white/15"
                    width={512}
                    height={512}
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}