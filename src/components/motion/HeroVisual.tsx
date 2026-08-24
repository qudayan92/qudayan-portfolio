'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Sparkles, Cpu } from 'lucide-react';

/** Hero 右侧：3D IP 形象 + 漂浮徽章。纯装饰，尊重减少动效。 */
export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex items-center justify-center">
      {/* 柔光背景 */}
      <div
        aria-hidden
        className="absolute h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-accent-400/30 via-violet-500/25 to-fuchsia-500/10 blur-3xl"
      />

      <div className="relative h-[24rem] w-[22rem]">
        {/* 顶部旋转的虚线光环 */}
        <motion.div
          aria-hidden
          className="absolute -inset-x-6 top-10 mx-auto h-64 w-64 rounded-full border border-white/10"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ borderStyle: 'dashed' }}
        >
          <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.6)]" />
          <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-violet-400 shadow-[0_0_12px_2px_rgba(139,92,246,0.6)]" />
        </motion.div>

        {/* IP 主形象 */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={reduce ? false : { scale: 0.86, opacity: 0, y: 24 }}
          animate={reduce ? undefined : { scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative h-[21rem] w-[21rem] overflow-hidden rounded-[2rem] ring-1 ring-white/15 shadow-2xl shadow-violet-500/20">
            <img
              src="/ip-pm.png"
              alt="瞿达炎 IP 形象"
              className="h-full w-full object-cover"
              width={420}
              height={420}
            />
            {/* 底部渐隐，融合背景 */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/80 to-transparent" />
          </div>
        </motion.div>

        {/* 漂浮徽章：PM */}
        <motion.div
          className="absolute -left-6 top-12 z-10 rounded-xl border border-white/10 bg-ink-800/85 px-3 py-2 backdrop-blur-md"
          animate={reduce ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="font-display text-lg font-semibold text-white">PM</div>
          <div className="text-[10px] text-neutral-400">Product</div>
        </motion.div>

        {/* 漂浮徽章：AIGC */}
        <motion.div
          className="absolute -right-5 top-24 z-10 rounded-xl border border-white/10 bg-ink-800/85 px-3 py-2 backdrop-blur-md"
          animate={reduce ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            <span className="font-display text-sm font-semibold text-white">AIGC</span>
          </div>
          <div className="text-[10px] text-neutral-400">Workflow</div>
        </motion.div>

        {/* 漂浮徽章：9+ yrs */}
        <motion.div
          className="absolute right-4 -top-2 z-10 rounded-xl border border-white/10 bg-ink-800/85 px-3 py-1.5 backdrop-blur-md"
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <span className="font-display text-sm font-semibold text-accent-200">9+ yrs</span>
        </motion.div>

        {/* 漂浮徽章：IoT */}
        <motion.div
          className="absolute -left-4 bottom-10 z-10 rounded-xl border border-white/10 bg-ink-800/85 px-3 py-1.5 backdrop-blur-md"
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-accent-400" />
            <span className="font-display text-sm font-semibold text-white">IoT</span>
          </div>
        </motion.div>

        {/* 底部滚动提示 */}
        <motion.div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-neutral-500"
          animate={reduce ? undefined : { y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </div>
    </div>
  );
}
