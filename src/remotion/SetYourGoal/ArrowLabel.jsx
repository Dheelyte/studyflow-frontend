export const ArrowLabel = ({ x, y, opacity = 1, drawProgress = 1, bob = 0 }) => {
  const pathLength = 180;
  const dashOffset = pathLength * (1 - drawProgress);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity,
        transform: `translateY(${bob}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily: '"Caveat", "Comic Sans MS", cursive',
          fontSize: 28,
          fontWeight: 700,
          color: "#6366f1",
          transform: "rotate(-6deg)",
          marginBottom: 4,
          whiteSpace: "nowrap",
        }}
      >
        Click to generate!
      </div>
      <svg
        width="130"
        height="90"
        viewBox="0 0 130 90"
        style={{ overflow: "visible" }}
      >
        <path
          d="M 10 10 C 40 20, 70 40, 100 75"
          stroke="#6366f1"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={dashOffset}
        />
        <path
          d="M 100 75 L 88 65 M 100 75 L 94 88"
          stroke="#6366f1"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity={drawProgress > 0.85 ? 1 : 0}
        />
      </svg>
    </div>
  );
};
