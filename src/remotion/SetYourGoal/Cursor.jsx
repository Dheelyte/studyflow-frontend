export const Cursor = ({ x, y, scale = 1, rippleScale = 0, rippleOpacity = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-2px, -2px) scale(${scale})`,
      transformOrigin: "2px 2px",
      pointerEvents: "none",
      filter: "drop-shadow(0 6px 12px rgba(15, 23, 42, 0.35))",
    }}
  >
    {rippleOpacity > 0 && (
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 120,
          height: 120,
          transform: `translate(-50%, -50%) scale(${rippleScale})`,
          borderRadius: "50%",
          border: "2px solid #6366f1",
          opacity: rippleOpacity,
        }}
      />
    )}
    <svg
      width="34"
      height="40"
      viewBox="0 0 34 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 2 L4 30 L11 23 L15 33 L20 31 L16 21 L26 21 Z"
        fill="#ffffff"
        stroke="#111827"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
