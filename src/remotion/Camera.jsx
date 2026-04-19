import { AbsoluteFill, interpolate, Easing } from "remotion";

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const SCREEN_CENTER_X = 640;
const SCREEN_CENTER_Y = 360;

export const Camera = ({ focusX, focusY, scale, children }) => (
  <AbsoluteFill
    style={{
      transform: `translate(${SCREEN_CENTER_X - focusX * scale}px, ${SCREEN_CENTER_Y - focusY * scale}px) scale(${scale})`,
      transformOrigin: "0 0",
    }}
  >
    {children}
  </AbsoluteFill>
);

export const useCameraPath = (frame, keyframes, defaults = { x: 640, y: 360, scale: 1 }) => {
  if (!keyframes || keyframes.length === 0) return defaults;

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  if (frame <= sorted[0].frame) {
    return {
      x: sorted[0].x ?? defaults.x,
      y: sorted[0].y ?? defaults.y,
      scale: sorted[0].scale ?? defaults.scale,
    };
  }

  const last = sorted[sorted.length - 1];
  if (frame >= last.frame) {
    return {
      x: last.x ?? defaults.x,
      y: last.y ?? defaults.y,
      scale: last.scale ?? defaults.scale,
    };
  }

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const t = (frame - a.frame) / (b.frame - a.frame);
      const eased = easeInOut(t);
      return {
        x: interpolate(eased, [0, 1], [a.x ?? defaults.x, b.x ?? defaults.x]),
        y: interpolate(eased, [0, 1], [a.y ?? defaults.y, b.y ?? defaults.y]),
        scale: interpolate(
          eased,
          [0, 1],
          [a.scale ?? defaults.scale, b.scale ?? defaults.scale]
        ),
      };
    }
  }

  return defaults;
};
