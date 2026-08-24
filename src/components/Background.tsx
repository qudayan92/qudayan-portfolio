export function Background() {
  return (
    <>
      {/* 背景图片层：环境光 + 网格地板（缓慢缩放转场） */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div
          className="bg-kenburns absolute inset-0"
          style={{
            backgroundImage: 'url(/bg-ambient.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.55,
          }}
        />
      </div>

      {/* 极光流场景转换 */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="aurora aurora-a" />
        <div className="aurora aurora-b" />
      </div>

      {/* 缓慢旋转的虚线光环 */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-ring h-[70vh] w-[70vh] left-[-10%] top-[10%]" />
        <div className="bg-ring h-[55vh] w-[55vh] right-[-8%] bottom-[-5%]" style={{ animationDirection: 'reverse', animationDuration: '80s' }} />
      </div>

      {/* 漂浮粒子 */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-particle h-1.5 w-1.5 left-[12%] top-[70%]" style={{ animationDuration: '14s', animationDelay: '0s' }} />
        <div className="bg-particle h-1 w-1 left-[28%] top-[80%]" style={{ animationDuration: '18s', animationDelay: '2s' }} />
        <div className="bg-particle violet h-1.5 w-1.5 left-[45%] top-[75%]" style={{ animationDuration: '16s', animationDelay: '4s' }} />
        <div className="bg-particle h-1 w-1 left-[60%] top-[85%]" style={{ animationDuration: '20s', animationDelay: '1s' }} />
        <div className="bg-particle violet h-1 w-1 left-[75%] top-[78%]" style={{ animationDuration: '15s', animationDelay: '6s' }} />
        <div className="bg-particle h-1.5 w-1.5 left-[88%] top-[72%]" style={{ animationDuration: '22s', animationDelay: '3s' }} />
      </div>

      {/* 顶部渐变到纯黑，让内容可读 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-fade"
      />
      {/* 网格 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-40"
      />
      {/* 漂浮动效光球 */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="orb orb-a -top-32 -left-24 h-80 w-80 bg-violet-500/40" />
        <div className="orb orb-b top-1/3 -right-40 h-96 w-96 bg-accent-400/30" />
        <div className="orb orb-c -bottom-40 left-1/4 h-96 w-96 bg-fuchsia-500/25" />
      </div>
      {/* 噪点 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-overlay bg-noise"
      />
    </>
  );
}
