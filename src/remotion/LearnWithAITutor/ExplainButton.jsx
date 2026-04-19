export const EXPLAIN_BTN_WIDTH = 270;
export const EXPLAIN_BTN_HEIGHT = 64;

export const ExplainButton = ({
  enter = 1,
  buttonScale = 1,
  sparkleTime = 0,
}) => {
  const sparkles = Array.from({ length: 6 }).map((_, i) => {
    const angle = (i / 6) * Math.PI * 2 + sparkleTime * 0.04;
    const r = 38 + Math.sin(sparkleTime / 8 + i) * 6;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const size = 6 + (i % 3) * 3;
    const opacity = 0.55 + Math.sin(sparkleTime / 6 + i * 1.2) * 0.35;
    return { x, y, size, opacity };
  });

  return (
    <div
      style={{
        transform: `translateX(${(1 - enter) * 60}px) scale(${buttonScale})`,
        opacity: enter,
        position: "relative",
        display: "inline-block",
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <svg
        width="80"
        height="80"
        viewBox="-40 -40 80 80"
        style={{
          position: "absolute",
          left: -24,
          top: -16,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {sparkles.map((s, i) => (
          <g key={i} transform={`translate(${s.x} ${s.y})`} opacity={s.opacity}>
            <path
              d={`M 0 -${s.size} L ${s.size * 0.3} -${s.size * 0.3} L ${s.size} 0 L ${s.size * 0.3} ${s.size * 0.3} L 0 ${s.size} L -${s.size * 0.3} ${s.size * 0.3} L -${s.size} 0 L -${s.size * 0.3} -${s.size * 0.3} Z`}
              fill="#a855f7"
            />
          </g>
        ))}
      </svg>

      <button
        style={{
          width: EXPLAIN_BTN_WIDTH,
          height: EXPLAIN_BTN_HEIGHT,
          padding: "0 22px",
          background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
          color: "white",
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontSize: 18,
          fontWeight: 700,
          border: "none",
          boxShadow:
            "0 14px 30px -6px rgba(99, 102, 241, 0.6), 0 6px 14px -4px rgba(168, 85, 247, 0.4)",
          cursor: "pointer",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        <span>Explain this part</span>
        <span style={{ fontSize: 22 }}>✨</span>
      </button>
    </div>
  );
};
