"use client";

import FlameWrap from "./CanvasFlameWrap";

const SPOTLIGHT_OPTIONS = {
  color: [0.94, 0.58, 0.7],
  intensity: 0.42,
  height: 42,
  spread: 12,
  radius: 6,
  speed: 0.18,
  scale: 0.68,
  turbulence: 0.28,
  turbulenceScale: 0.7,
  turbulenceReach: 8,
  sparks: 0.55,
  sparkSize: 0.34,
  sparkDensity: 0.72,
  sparkSpeed: 0.68,
  rim: 1.18,
  melt: 0,
  distortion: 0,
  smoke: 0.12,
  ember: 0.55,
  scorch: 0,
};

export default function BirthdayGlowFrame({
  children,
  variant = "spotlight",
  className = "",
}) {
  const rootClass =
    `birthday-glow-frame birthday-glow-frame--${variant} ${className}`.trim();

  if (variant !== "mini") {
    return (
      <FlameWrap
        className={`${rootClass} birthday-glow-frame--canvas`}
        {...SPOTLIGHT_OPTIONS}
      >
        <span className="birthday-flame" aria-hidden="true" />
        <span className="birthday-rim" aria-hidden="true" />
        <span className="birthday-sparks" aria-hidden="true" />
        {children}
      </FlameWrap>
    );
  }

  return (
    <div className={rootClass}>
      <span className="birthday-flame" aria-hidden="true" />
      <span className="birthday-rim" aria-hidden="true" />
      <span className="birthday-sparks" aria-hidden="true" />
      {children}
    </div>
  );
}
