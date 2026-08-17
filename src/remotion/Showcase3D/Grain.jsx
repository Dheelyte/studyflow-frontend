const SRC_WIDTH = 320;
const SRC_HEIGHT = 180;
const UPSCALE = 4;

// Rendered small and scaled up: feTurbulence at full frame size is slow enough
// to dominate render time, and the upscale is what turns fine noise into
// filmic grain. Doubles as dither for the ambient gradient, which bands badly
// in the darkest part of the range.
export const Grain = ({ frame, opacity = 0.06 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      opacity,
      mixBlendMode: "overlay",
      overflow: "hidden",
    }}
  >
    <svg
      width={SRC_WIDTH}
      height={SRC_HEIGHT}
      style={{
        display: "block",
        transform: `scale(${UPSCALE})`,
        transformOrigin: "0 0",
      }}
    >
      <filter id="showcase3dGrain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="1"
          seed={frame % 128}
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={SRC_WIDTH} height={SRC_HEIGHT} filter="url(#showcase3dGrain)" />
    </svg>
  </div>
);
