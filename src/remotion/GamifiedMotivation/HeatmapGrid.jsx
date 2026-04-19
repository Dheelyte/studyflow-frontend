import { interpolate, Easing } from "remotion";

export const WEEKS = 40;
export const DAYS = 7;
export const CELL_SIZE = 14;
export const CELL_GAP = 3;
export const GRID_WIDTH = WEEKS * (CELL_SIZE + CELL_GAP) - CELL_GAP;
export const GRID_HEIGHT = DAYS * (CELL_SIZE + CELL_GAP) - CELL_GAP;

const COLORS = [
  "rgba(99, 102, 241, 0.08)",
  "rgba(99, 102, 241, 0.4)",
  "rgba(99, 102, 241, 0.6)",
  "rgba(99, 102, 241, 0.8)",
  "#6366f1",
];

const seededRand = (seed) => {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const buildIntensity = (week, day) => {
  const r = seededRand(week * 13 + day * 7);
  const r2 = seededRand(week * 29 + day * 3);

  if (week < 10) {
    if (r > 0.65) return 1;
    if (r > 0.9) return 2;
    return 0;
  }
  if (week < 24) {
    if (r > 0.8) return 3;
    if (r > 0.55) return 2;
    if (r > 0.35) return 1;
    return 0;
  }
  if (week < 34) {
    if (r > 0.8) return 4;
    if (r > 0.55) return 3;
    if (r > 0.3) return 2;
    if (r > 0.15) return 1;
    return 0;
  }
  if (r2 > 0.75) return 4;
  if (r2 > 0.4) return 3;
  if (r2 > 0.15) return 2;
  return 1;
};

export const HEATMAP = Array.from({ length: WEEKS }, (_, w) =>
  Array.from({ length: DAYS }, (_, d) => buildIntensity(w, d))
);

export const TODAY_WEEK = WEEKS - 1;
export const TODAY_DAY = 4;

export const getCellPosition = (week, day) => ({
  x: week * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
  y: day * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
});

const easeOut = Easing.out(Easing.cubic);

export const HeatmapGrid = ({
  frame,
  startFrame = 0,
  duration = 90,
  todayPulse = 0,
  streakHighlight = 0,
}) => {
  const cellsPerFrame = (WEEKS * DAYS) / duration;

  return (
    <svg
      width={GRID_WIDTH}
      height={GRID_HEIGHT}
      style={{ display: "block", overflow: "visible" }}
    >
      {HEATMAP.map((col, w) =>
        col.map((intensity, d) => {
          const cellIdx = w * DAYS + d;
          const revealStart = startFrame + cellIdx / cellsPerFrame;
          const t = Math.max(0, Math.min(1, (frame - revealStart) / 6));
          const eased = easeOut(t);

          if (t <= 0) return null;

          const { x, y } = getCellPosition(w, d);
          const baseColor = COLORS[intensity];
          const isToday = w === TODAY_WEEK && d === TODAY_DAY;
          const inRecentStreak = w >= WEEKS - 7 && streakHighlight > 0;

          const scale = eased;
          const glow = isToday ? todayPulse : 0;
          const streakGlow = inRecentStreak
            ? streakHighlight * (intensity > 0 ? 0.7 : 0)
            : 0;

          return (
            <g key={`${w}-${d}`} transform={`translate(${x}, ${y})`}>
              {glow > 0 && (
                <rect
                  x={-CELL_SIZE / 2 - 3}
                  y={-CELL_SIZE / 2 - 3}
                  width={CELL_SIZE + 6}
                  height={CELL_SIZE + 6}
                  rx={4}
                  fill="#6366f1"
                  opacity={glow * 0.35}
                />
              )}
              <rect
                x={-CELL_SIZE / 2}
                y={-CELL_SIZE / 2}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2.5}
                fill={baseColor}
                transform={`scale(${scale})`}
                style={{
                  filter:
                    streakGlow > 0
                      ? `drop-shadow(0 0 ${streakGlow * 5}px rgba(99,102,241,${streakGlow * 0.9}))`
                      : "none",
                }}
              />
            </g>
          );
        })
      )}
    </svg>
  );
};

export const HeatmapPanel = ({ children, opacity = 1 }) => (
  <div
    style={{
      background: "white",
      border: "1px solid rgba(99, 102, 241, 0.1)",
      borderRadius: 18,
      padding: "24px 28px",
      boxShadow: "0 24px 48px -18px rgba(15, 23, 42, 0.18), 0 6px 18px rgba(15, 23, 42, 0.04)",
      fontFamily: '"Google Sans", "Inter", sans-serif',
      opacity,
      transform: `translateY(${(1 - opacity) * 28}px)`,
    }}
  >
    {children}
  </div>
);

export const HeatmapLegend = ({ opacity = 1 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 11,
      color: "#6b7280",
      fontWeight: 500,
      opacity,
    }}
  >
    <span>Less</span>
    {COLORS.map((c, i) => (
      <div
        key={i}
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          background: c,
          borderRadius: 2.5,
        }}
      />
    ))}
    <span>More</span>
  </div>
);

export { interpolate };
