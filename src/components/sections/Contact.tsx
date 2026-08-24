import { me } from '@/lib/profile';
import { ContactForm } from '@/components/ai/ContactForm';
import { Reveal } from '@/components/motion/Reveal';

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="glass rounded-3xl p-8 md:p-14 relative overflow-hidden">
            {/* 背景图片层 */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ backgroundImage: 'url(/bg-ambient.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div aria-hidden className="absolute inset-0 bg-ink-950/70" />
            {/* 装饰光 */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-gradient-to-br from-accent-400/30 to-violet-500/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 blur-3xl"
            />

            <p className="eyebrow relative">Contact · 联系</p>
            <h2 className="relative mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              聊一个产品机会，或<span className="text-gradient">交个朋友</span>。
            </h2>
            <p className="relative mt-4 max-w-2xl text-neutral-400 leading-relaxed">
              现在在看 <b className="text-white">{me.target.city}</b> 的产品经理机会，
              期望薪资 <b className="text-white">{me.target.salary}</b>。
              如果你的团队正在做有意思的事，欢迎随时联系。
            </p>

            <div className="relative mt-10 flex flex-wrap gap-3">
              <a
                href={`mailto:${me.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-white text-ink-950 px-5 py-2.5 text-sm font-medium hover:bg-accent-200 transition"
              >
                ✉  发邮件
              </a>
              <a
                href={`tel:${me.phone}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm hover:border-white/30 transition"
              >
                📞  {me.phone}
              </a>
              <a
                href={me.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm hover:border-white/30 transition"
              >
                GitHub ↗
              </a>
            </div>

            <div className="relative mt-10 grid sm:grid-cols-3 gap-4 text-sm text-neutral-400">
              <div className="rounded-xl border border-white/5 p-4">
                <div className="text-xs text-neutral-500 mb-1">在职状态</div>
                <div className="flex items-center gap-2 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                  在职 · 可聊机会
                </div>
              </div>
              <div className="rounded-xl border border-white/5 p-4">
                <div className="text-xs text-neutral-500 mb-1">到岗</div>
                <div className="text-white">一个月内</div>
              </div>
              <div className="rounded-xl border border-white/5 p-4">
                <div className="text-xs text-neutral-500 mb-1">工作模式</div>
                <div className="text-white">全职 · 现场</div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}