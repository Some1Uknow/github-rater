"use client";

export function ScanlineOverlay() {
  return (
    <>
      {/* Scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
      />
      {/* CRT Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 0%,
            transparent 60%,
            rgba(0, 0, 0, 0.4) 100%
          )`,
        }}
      />
      {/* Subtle flicker animation - barely noticeable */}
      <div className="pointer-events-none fixed inset-0 z-50 animate-flicker opacity-[0.01] bg-white" />
    </>
  );
}
