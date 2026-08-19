import { me } from '@/lib/profile';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center gap-2 eyebrow">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-400" />
          {me.role} · {me.city}
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
          你好，我是 <span className="text-gradient">{me.name}</span>
          <span className="block text-neutral-300 mt-2">—— 一个会做产品的设计师。</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg md:text-xl text-neutral-400 leading-relaxed">
          {me.tagline}
          <br />
          从室内装饰设计 → UI / 交互 → 产品经理，过去 {new Date().getFullYear() - 2016}+ 年
          一直在「让用户感受到温度」这件事上较劲。
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-ink-950 px-5 py-2.5 text-sm font-medium hover:bg-accent-200 transition"
          >
            约个面试
            <span className="transition group-hover:translate-x-0.5">→</span>
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm hover:border-white/30 transition"
          >
            读我的笔记
          </Link>
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-neutral-400 hover:text-white transition"
          >
            看项目 ↓
          </Link>
        </div>

        {/* 数据条 */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 border-t border-white/5 pt-8">
          {[
            { k: '9+', v: '年互联网产品 / 设计经验' },
            { k: '2000+', v: '智能家居集采销量' },
            { k: '5W', v: '单产品线峰值日活' },
            { k: '18-20K', v: '期望薪资 · 深圳' },
          ].map((it) => (
            <div key={it.v} className="">
              <div className="font-display text-3xl md:text-4xl text-white">
                {it.k}
              </div>
              <div className="mt-1 text-xs text-neutral-500">{it.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}