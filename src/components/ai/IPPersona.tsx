'use client';

// 独立 IP 主讲人：站着、会跟随鼠标、打招呼、点击有反应，随语音介绍简历。
// 素材集中配置在 src/lib/profile.ts 的 `ip`：
//   - portrait: 头肩头像(兜底)
//   - fullBody: 全身站立立绘路径(填了就用全身直立呈现；为空则用 portrait)
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useState } from 'react';
import { ip } from '@/lib/profile';

const REACTIONS = [
  '很高兴认识你 👋',
  '想听听我做过什么吗？',
  '这些产品我都很有把握 😊',
  '有想法随时找我聊～',
  '做产品，我最看重用户真的用得上 👍',
  '从一个想法到上线，我都能搞定 💪',
  '想约个时间聊聊机会吗？',
];

export function IPPersona({
  visible,
  speaking,
  text,
}: {
  visible: boolean;
  speaking: boolean;
  text: string;
}) {
  const reduce = useReducedMotion();
  const [reactionIndex, setReactionIndex] = useState(0);
  const [poke, setPoke] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  // 全身立绘可用性（填了路径且没加载失败）
  const fullBody = (ip.fullBody || '').trim();
  const usingFull = !!fullBody && !imgErr;
  const src = usingFull ? fullBody : ip.portrait;

  // 鼠标跟随 → 轻微 3D 倾斜
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 120, damping: 18 };
  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), spring);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const onTap = () => {
    setPoke((p) => p + 1);
    setReactionIndex((i) => (i + 1) % REACTIONS.length);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 26, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 22, scale: 0.94 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-24 right-5 z-50 w-72 overflow-visible"
          style={{ perspective: 760 }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <motion.div
            className="rounded-2xl border border-white/10 bg-ink-900/85 p-4 shadow-2xl backdrop-blur-md"
            style={{ transformStyle: 'preserve-3d', rotateX, rotateY }}
          >
            <div className={`flex items-start gap-3.5 ${usingFull ? 'items-end' : ''}`}>
              {/* 站立/展示的人物 + 舞台 */}
              <div
                className={`relative flex flex-none items-end justify-center ${
                  usingFull ? 'h-48 w-32' : 'h-28 w-24'
                }`}
              >
                {/* 舞台光/地面 */}
                <div
                  aria-hidden
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full blur-[6px] ${
                    usingFull ? 'h-3 w-24 bg-accent-400/25' : 'h-3 w-16 bg-accent-400/20'
                  }`}
                />
                {/* 交互区（点击打招呼/换一句） */}
                <motion.div
                  key={poke}
                  className="relative flex cursor-pointer items-end justify-center"
                  onClick={onTap}
                  animate={reduce ? undefined : { rotate: [0, -6, 6, -4, 4, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  {/* 出场挥手 */}
                  <span
                    aria-hidden
                    className={`absolute right-0 top-0 z-10 text-xl ${
                      usingFull ? '-right-1' : '-right-2 -top-2'
                    }`}
                  >
                    <motion.span
                      className="inline-block"
                      style={{ transform: 'rotate(15deg)' }}
                      animate={reduce ? undefined : { rotate: [0, -18, 0, -18, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2 }}
                    >
                      👋
                    </motion.span>
                  </span>

                  {/* 浮动的主体（说话时更活泼） */}
                  <motion.div
                    className="relative flex w-full items-end justify-center"
                    animate={reduce ? undefined : { y: speaking ? [0, -7, 0] : [0, -4, 0] }}
                    transition={{
                      duration: speaking ? 1.1 : 3.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div
                      aria-hidden
                      className={`absolute blur-md animate-pulse ${
                        usingFull
                          ? '-inset-3 bg-gradient-to-b from-accent-400/30 via-violet-500/25 to-fuchsia-500/20'
                          : '-inset-1.5 rounded-full bg-gradient-to-br from-accent-400/40 via-violet-500/40 to-fuchsia-500/30'
                      }`}
                    />
                    {usingFull ? (
                      <img
                        src={src}
                        alt="瞿达炎 IP 全身立绘"
                        className="relative h-44 w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.45)]"
                        onError={() => setImgErr(true)}
                      />
                    ) : (
                      <img
                        src={src}
                        alt="瞿达炎 IP 形象"
                        className="relative h-24 w-24 rounded-2xl object-cover ring-1 ring-white/20"
                        onError={() => setImgErr(true)}
                      />
                    )}
                  </motion.div>

                  {/* 说话中的声纹 */}
                  {speaking && (
                    <span className="absolute -bottom-1 left-1/2 flex -translate-x-1/2 items-end gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1 rounded-full bg-accent-300"
                          animate={{ height: [4, 10, 4] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* 文案区 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white">{ip.name}</span>
                  <span className="rounded-full border border-accent-400/30 bg-accent-400/10 px-1.5 py-0.5 text-[10px] text-accent-200">
                    {ip.role}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-4 text-[11px] leading-relaxed text-neutral-300">
                  {speaking ? text : REACTIONS[reactionIndex]}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 底部提示 */}
          <div className="mt-1.5 text-center text-[10px] text-neutral-600">
            点击人物互动 · 正在为你介绍简历
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
