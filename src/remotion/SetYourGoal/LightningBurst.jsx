export const LightningBurst = ({ x, y, progress = 0 }) => {
  if (progress <= 0) return null;

  const burstScale = 0.2 + progress * 2.2;
  const burstOpacity = Math.max(0, 1 - progress) * 0.9;

  const sparks = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 30 + progress * 140;
    const sx = Math.cos(angle) * distance;
    const sy = Math.sin(angle) * distance;
    const sparkOpacity = Math.max(0, 1 - progress) * 0.95;
    const sparkLength = 14 + progress * 10;
    return (
      <line
        key={i}
        x1={sx * 0.65}
        y1={sy * 0.65}
        x2={sx}
        y2={sy}
        stroke="#fbbf24"
        strokeWidth={3 * (1 - progress * 0.6)}
        strokeLinecap="round"
        opacity={sparkOpacity}
      />
    );
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
      }}
    >
      <svg
        width="400"
        height="400"
        viewBox="-200 -200 400 400"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="burstGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#a5b4fc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle
          cx="0"
          cy="0"
          r="60"
          fill="url(#burstGrad)"
          opacity={burstOpacity}
          transform={`scale(${burstScale})`}
        />
        {sparks}
      </svg>
    </div>
  );
};
