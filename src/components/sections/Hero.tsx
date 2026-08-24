'use client';

import { motion, useReducedMotion, useInView } from 'framer-motion';
import { me } from '@/lib/profile';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { HeroVisual } from '@/components/motion/HeroVisual';

// 数字动画：从 0 计数到目标
function useCountUp(target: number, started: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, started, duration]);
  return value;
}

function Stat({
  target,
  suffix,
  label,
  started,
}: {
  target: number;
  suffix: string;
  label: string;
  started: boolean;
}) {
  const v = useCountUp(target, started);
  return (
    <div>
      <div className="font-display text-3xl md:text-4xl text-white">
        {v}
        <span className="text-gradient">{suffix}</span>
      </div>
      <div className="mt-1 text-xs text-neutral-500">{label}</div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });
  const started = statsInView || !reduce;

  const fadeUp = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative pt-32 md:pt-40 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div className="relative">
            <motion.div {...fadeUp(0.02)} className="flex items-center gap-2 eyebrow">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-dot" />
              {me.role} · {me.city}
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
            >
              你好，我是 <span className="text-gradient">{me.name}</span>
              <span className="block text-neutral-300 mt-2">—— 一个会做产品的设计师。</span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="mt-8 max-w-2xl text-lg md:text-xl text-neutral-400 leading-relaxed"
            >
              {me.tagline}
              <br />
              从室内装饰设计 → UI / 交互 → 产品经理，过去 {new Date().getFullYear() - 2016}+ 年
              一直在「让用户感受到温度」这件事上较劲。
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-wrap gap-3">
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
            </motion.div>

            {/* 数据条：进入视口触发计数 */}
            <motion.div
              {...fadeUp(0.4)}
              ref={statsRef}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 border-t border-white/5 pt-8"
            >
              <Stat target={9} suffix="+" label="年互联网产品 / 设计经验" started={started} />
              <Stat target={2000} suffix="+" label="智能家居集采销量" started={started} />
              <Stat target={5} suffix="W" label="单产品线峰值日活" started={started} />
              <div>
                <div className="font-display text-3xl md:text-4xl text-white">
                  18-20<span className="text-gradient">K</span>
                </div>
                <div className="mt-1 text-xs text-neutral-500">期望薪资 · 深圳</div>
              </div>
            </motion.div>
          </div>

          {/* 右侧视觉 */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
