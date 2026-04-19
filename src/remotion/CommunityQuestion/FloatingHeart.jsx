import { useCurrentFrame, interpolate, Easing } from "remotion";
import { HeartIcon } from "../icons";

const HEARTS = Array.from({ length: 8 }, (_, i) => {
  const seed = (i + 1) * 3.17;
  const r = (n) => {
    const s = Math.sin(seed * (n + 1)) * 10000;
    return s - Math.floor(s);
  };
  return {
    delay: Math.floor(r(1) * 24),
    drift: (r(2) - 0.5) * 60,
    size: 16 + Math.floor(r(3) * 8),
    duration: 46 + Math.floor(r(4) * 18),
    phase: r(5) * Math.PI * 2,
  };
});

export const FloatingHearts = ({ startFrame, originX, originY, active = true }) => {
  const frame = useCurrentFrame();
  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {HEARTS.map((h, i) => {
        const t = (frame - startFrame - h.delay) / h.duration;
        if (t < 0 || t > 1) return null;

        const eased = Easing.out(Easing.cubic)(t);
        const rise = eased * 130;
        const wiggle = Math.sin(t * Math.PI * 2 + h.phase) * 14;

        const opacity = interpolate(t, [0, 0.15, 0.8, 1], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const scale = interpolate(t, [0, 0.25, 1], [0.4, 1, 0.85]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: originX + h.drift + wiggle,
              top: originY - rise,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              filter: "drop-shadow(0 4px 10px rgba(239, 68, 68, 0.35))",
            }}
          >
            <HeartIcon size={h.size} color="#ef4444" fill="#ef4444" />
          </div>
        );
      })}
    </div>
  );
};
