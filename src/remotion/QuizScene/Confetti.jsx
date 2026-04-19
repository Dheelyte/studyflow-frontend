import { useCurrentFrame, interpolate, Easing } from "remotion";

const COLORS = [
  "#6366f1",
  "#a855f7",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#eab308",
];

const PARTICLE_COUNT = 80;

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const seed = i * 9301 + 49297;
  const rand = (n) => {
    const s = Math.sin(seed * (n + 1)) * 10000;
    return s - Math.floor(s);
  };
  const angle = rand(1) * Math.PI * 2;
  const speed = 320 + rand(2) * 520;
  const size = 6 + rand(3) * 8;
  const isCircle = rand(4) > 0.6;
  const delay = Math.floor(rand(5) * 10);
  const spin = (rand(6) - 0.5) * 14;
  const horizontalDrift = (rand(7) - 0.5) * 80;
  return {
    color: COLORS[i % COLORS.length],
    angle,
    speed,
    size,
    isCircle,
    delay,
    spin,
    horizontalDrift,
    startRotation: rand(8) * 360,
  };
});

export const Confetti = ({ startFrame = 0, duration = 120, originX, originY }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - startFrame;

  if (localFrame < 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {PARTICLES.map((p, i) => {
        const t = (localFrame - p.delay) / duration;
        if (t < 0 || t > 1.1) return null;

        const eased = Easing.out(Easing.quad)(Math.min(t, 1));
        const distance = p.speed * eased;
        const gravity = 1.6 * t * t * 520;

        const x = originX + Math.cos(p.angle) * distance + p.horizontalDrift * t;
        const y = originY + Math.sin(p.angle) * distance + gravity;

        const opacity = interpolate(t, [0, 0.15, 0.85, 1.05], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const rotation = p.startRotation + p.spin * localFrame;
        const scaleY = p.isCircle ? 1 : 0.5 + Math.abs(Math.sin(rotation * 0.04)) * 0.6;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.isCircle ? "50%" : 2,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scaleY(${scaleY})`,
              opacity,
              boxShadow: `0 0 6px ${p.color}55`,
            }}
          />
        );
      })}
    </div>
  );
};
