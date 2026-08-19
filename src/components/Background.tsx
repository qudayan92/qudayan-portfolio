export function Background() {
  return (
    <>
      {/* 顶部渐变光晕 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-grid-fade"
      />
      {/* 网格 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 grid-bg opacity-60"
      />
      {/* 噪点 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.04] mix-blend-overlay bg-noise"
      />
    </>
  );
}