import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const Backdrop = ({ filterId = "orbBlur" }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const orb = (cx, cy, r, color, speed, phase) => {
    const t = (frame + phase) / speed;
    const dx = Math.sin(t) * 30;
    const dy = Math.cos(t * 0.8) * 24;
    return (
      <circle
        cx={cx + dx}
        cy={cy + dy}
        r={r}
        fill={color}
        opacity={0.55 * fade}
      />
    );
  };

  const dotSize = 2;
  const gap = 40;
  const dots = [];
  for (let x = gap / 2; x < width; x += gap) {
    for (let y = gap / 2; y < height; y += gap) {
      dots.push(
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={dotSize / 2}
          fill="#6366f1"
          opacity={0.08 * fade}
        />
      );
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #f5f7ff 0%, #eef0ff 50%, #faf5ff 100%)",
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {orb(width * 0.18, height * 0.28, 160, "#a78bfa", 55, 0)}
          {orb(width * 0.82, height * 0.72, 180, "#6366f1", 70, 40)}
          {orb(width * 0.72, height * 0.22, 110, "#ec4899", 65, 80)}
          {orb(width * 0.22, height * 0.82, 140, "#06b6d4", 80, 120)}
        </g>
        {dots}
      </svg>
    </AbsoluteFill>
  );
};
