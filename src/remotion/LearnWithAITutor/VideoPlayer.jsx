import { interpolate } from "remotion";
import { PlayIcon } from "../icons";

export const VIDEO_WIDTH = 640;
export const VIDEO_HEIGHT = 360;

export const VideoPlayer = ({
  enter = 1,
  playProgress = 0,
  playbackTime = 0,
}) => {
  const barValues = [0.35, 0.62, 0.48, 0.78, 0.55, 0.88, 0.42, 0.71];
  const barCount = barValues.length;

  const titleFade = interpolate(playbackTime, [0, 12, 60, 72], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)",
        boxShadow:
          "0 40px 80px -30px rgba(15, 23, 42, 0.55), 0 10px 30px -10px rgba(99, 102, 241, 0.3)",
        transform: `scale(${enter})`,
        opacity: enter,
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.35), transparent 60%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.25), transparent 55%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.9)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#a5b4fc",
              textTransform: "uppercase",
              opacity: titleFade,
            }}
          >
            Lesson 1 · Intro
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              marginTop: 4,
              opacity: titleFade,
            }}
          >
            What is Data Analysis?
          </div>
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#f8fafc",
            background: "rgba(255,255,255,0.12)",
            padding: "6px 12px",
            borderRadius: 999,
            letterSpacing: 0.5,
            opacity: titleFade,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          Primerly Tutor
        </div>
      </div>

      <svg
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {[0.2, 0.4, 0.6, 0.8].map((p, i) => (
          <line
            key={i}
            x1={60}
            x2={VIDEO_WIDTH - 60}
            y1={120 + p * 180}
            y2={120 + p * 180}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
        ))}

        {barValues.map((v, i) => {
          const chartLeft = 80;
          const chartRight = VIDEO_WIDTH - 80;
          const chartWidth = chartRight - chartLeft;
          const gap = 8;
          const barWidth = (chartWidth - (barCount - 1) * gap) / barCount;
          const x = chartLeft + i * (barWidth + gap);
          const baseY = VIDEO_HEIGHT - 80;
          const growStart = 10 + i * 5;
          const growEnd = growStart + 18;
          const growth = interpolate(playbackTime, [growStart, growEnd], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fullHeight = v * 190;
          const h = fullHeight * growth;
          const y = baseY - h;

          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={h}
                rx={6}
                fill="url(#barGrad)"
                opacity={0.95}
              />
              {growth > 0.9 && (
                <circle
                  cx={x + barWidth / 2}
                  cy={y}
                  r={4}
                  fill="#fbbf24"
                  opacity={interpolate(
                    playbackTime,
                    [growEnd, growEnd + 10],
                    [1, 0],
                    { extrapolateRight: "clamp" }
                  )}
                />
              )}
            </g>
          );
        })}

        <line
          x1={80}
          x2={VIDEO_WIDTH - 80}
          y1={VIDEO_HEIGHT - 80}
          y2={VIDEO_HEIGHT - 80}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${1 - playProgress})`,
          width: 88,
          height: 88,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1 - playProgress,
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.4)",
          pointerEvents: "none",
        }}
      >
        <PlayIcon size={40} color="#6366f1" fill="#6366f1" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "white",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <PlayIcon size={16} color="white" fill="white" />
        <span style={{ minWidth: 42 }}>
          {formatTime(playbackTime / 30)}
        </span>
        <div
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            background: "rgba(255,255,255,0.2)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, (playbackTime / 90) * 100)}%`,
              height: "100%",
              background: "#ef4444",
            }}
          />
        </div>
        <span style={{ minWidth: 42, textAlign: "right" }}>3:00</span>
      </div>
    </div>
  );
};

const formatTime = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};
