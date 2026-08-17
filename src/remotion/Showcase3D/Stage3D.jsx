import { AbsoluteFill, interpolate, Easing } from "remotion";

const easeInOut = Easing.bezier(0.83, 0, 0.17, 1);

const CHANNELS = ["rx", "ry", "rz", "x", "y", "z", "originX", "originY"];

export const STAGE_DEFAULTS = {
  rx: 0,
  ry: 0,
  rz: 0,
  x: 0,
  y: 0,
  z: 0,
  originX: 50,
  originY: 50,
};

// Carries perspective only. An `overflow`, `filter`, `opacity < 1`, `mask`,
// `mix-blend-mode`, `isolation` or `contain` on this element or on any Layer
// silently forces the subtree back to `transform-style: flat` — the symptom is
// accents moving in perfect lockstep with the panel.
export const Stage3D = ({
  perspective = 1600,
  originX = 50,
  originY = 50,
  rx = 0,
  ry = 0,
  rz = 0,
  x = 0,
  y = 0,
  z = 0,
  children,
}) => (
  <AbsoluteFill
    style={{
      perspective: `${perspective}px`,
      perspectiveOrigin: `${originX}% ${originY}%`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformStyle: "preserve-3d",
        // translate3d must come first so the stack pivots about its own centre
        // at depth z instead of orbiting the viewer.
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

// Sibling layers must never share a z value: inside a preserve-3d context paint
// order is decided by transformed depth, and coplanar siblings get
// implementation-defined ordering that flickers frame to frame.
export const Layer = ({ z = 0, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transformStyle: "preserve-3d",
      transform: `translateZ(${z}px)`,
      pointerEvents: "none",
    }}
  >
    {children}
  </div>
);

export const useStagePath = (
  frame,
  keyframes,
  defaults = STAGE_DEFAULTS,
  easing = easeInOut
) => {
  if (!keyframes || keyframes.length === 0) return defaults;

  const resolve = (kf) => {
    const out = {};
    CHANNELS.forEach((channel) => {
      out[channel] = kf[channel] ?? defaults[channel];
    });
    return out;
  };

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);

  if (frame <= sorted[0].frame) return resolve(sorted[0]);

  const last = sorted[sorted.length - 1];
  if (frame >= last.frame) return resolve(last);

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (frame >= a.frame && frame <= b.frame) {
      const span = b.frame - a.frame;
      if (span === 0) return resolve(b);

      const eased = easing((frame - a.frame) / span);
      const from = resolve(a);
      const to = resolve(b);
      const out = {};
      CHANNELS.forEach((channel) => {
        out[channel] = interpolate(eased, [0, 1], [from[channel], to[channel]]);
      });
      return out;
    }
  }

  return defaults;
};
