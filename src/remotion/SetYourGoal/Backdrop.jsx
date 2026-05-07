import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const Backdrop = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const fade = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

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
          fill="#a5b4fc"
          opacity={0.12 * fade}
        />
      );
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%)",
      }}
    >
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {dots}
      </svg>
    </AbsoluteFill>
  );
};
