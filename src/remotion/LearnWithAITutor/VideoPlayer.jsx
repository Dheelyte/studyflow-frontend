import { interpolate } from "remotion";
import { PlayIcon } from "../icons";

export const VIDEO_WIDTH = 640;
export const VIDEO_HEIGHT = 360;

// Hard cuts, in playback frames. A shot change is the single strongest signal
// that something is footage rather than an animation, so the content is cut
// into three takes instead of one continuous tween.
const CUT_1 = 132;
const CUT_2 = 268;

// Reads 0:42 at the moment the Explain button is clicked, matching the tutor
// panel's "Paused at 0:42".
const START_SECONDS = 41;
const TOTAL_SECONDS = 738;

const MONO = '"SF Mono", "Menlo", monospace';
const FONT = '"Google Sans", "Inter", sans-serif';

const CODE = [
  [[26, "#c792ea"], [44, "#82aaff"], [30, "#7fdbca"]],
  [[22, "#c792ea"], [58, "#82aaff"]],
  [],
  [[52, "#7fdbca"], [70, "#ecc48d"]],
  [[38, "#82aaff"], [46, "#f78c6c"], [28, "#7fdbca"]],
  [[64, "#7fdbca"], [34, "#ecc48d"], [22, "#82aaff"]],
  [],
  [[30, "#c792ea"], [76, "#82aaff"]],
  [[48, "#7fdbca"], [36, "#ecc48d"], [54, "#82aaff"]],
  [[20, "#f78c6c"], [62, "#7fdbca"]],
  [],
  [[34, "#c792ea"], [50, "#82aaff"], [26, "#ecc48d"]],
  [[58, "#7fdbca"], [30, "#f78c6c"]],
  [[42, "#82aaff"], [68, "#7fdbca"]],
];

const BARS = [0.42, 0.68, 0.51, 0.83, 0.6, 0.94, 0.47, 0.75];
const REGIONS = ["N", "S", "E", "W", "NE", "NW", "SE", "SW"];

const Pointer = ({ x, y }) => (
  <svg
    width="16"
    height="20"
    viewBox="0 0 16 20"
    style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }}
  >
    <path d="M1 1 L1 15 L5 11.5 L7.5 17.5 L10 16.5 L7.5 10.8 L12.5 10.5 Z" fill="#fff" stroke="#111" strokeWidth="1" />
  </svg>
);

const WindowChrome = ({ label }) => (
  <div
    style={{
      height: 26,
      background: "#161b2c",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "0 10px",
      flex: "none",
    }}
  >
    {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
      <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
    ))}
    <span style={{ marginLeft: 10, fontSize: 9, color: "#7b88a6", fontFamily: MONO }}>{label}</span>
  </div>
);

const CodeBlock = ({ scale = 1, typedTokens = 99, caretOn = false }) => (
  <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 * scale }}>
    {CODE.map((tokens, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, height: 6 * scale }}>
        <span style={{ width: 10, fontSize: 7, color: "#39435e", fontFamily: MONO, textAlign: "right" }}>
          {i + 1}
        </span>
        {tokens.slice(0, i < typedTokens ? tokens.length : 0).map(([w, c], t) => (
          <span key={t} style={{ width: w * scale, height: 5 * scale, borderRadius: 2, background: c, opacity: 0.9 }} />
        ))}
        {i === typedTokens && caretOn && (
          <span style={{ width: 1.5, height: 9 * scale, background: "#c7d2fe" }} />
        )}
      </div>
    ))}
  </div>
);

// Matplotlib-ish output: white canvas inside the dark editor.
const ChartOutput = ({ grow, hovered = -1, big = false }) => {
  const w = big ? 300 : 190;
  const h = big ? 190 : 118;
  return (
    <div style={{ background: "#f8fafc", borderRadius: 3, padding: big ? 14 : 10, width: w }}>
      <div style={{ fontSize: big ? 10 : 7.5, color: "#334155", fontFamily: FONT, marginBottom: 6 }}>
        sales_by_region
      </div>
      <div style={{ position: "relative", height: h, display: "flex", alignItems: "flex-end", gap: big ? 8 : 5 }}>
        {BARS.map((v, i) => {
          const local = interpolate(grow, [i * 0.07, i * 0.07 + 0.3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: v * h * local,
                background: i === hovered ? "#4338ca" : "#6366f1",
                borderRadius: "2px 2px 0 0",
              }}
            />
          );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, background: "#cbd5e1" }} />
        {hovered >= 0 && (
          <div
            style={{
              position: "absolute",
              left: `${(hovered / BARS.length) * 100}%`,
              bottom: BARS[hovered] * h + 8,
              background: "#0f172a",
              color: "#fff",
              fontSize: big ? 9 : 7,
              fontFamily: FONT,
              padding: "3px 6px",
              borderRadius: 3,
              whiteSpace: "nowrap",
            }}
          >
            {REGIONS[hovered]} · {Math.round(BARS[hovered] * 4200)}
          </div>
        )}
      </div>
    </div>
  );
};

// Take 1 — scrolling through the code, then running the cell.
const ShotCode = ({ t }) => {
  const ran = t > 74;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1220", display: "flex", flexDirection: "column" }}>
      <WindowChrome label="analysis.ipynb" />
      <div style={{ flex: 1, position: "relative", transform: `translateY(${-interpolate(t, [20, 70], [0, 26], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)` }}>
        <CodeBlock scale={1.3} />
        {ran && (
          <div style={{ padding: "0 22px", opacity: interpolate(t, [74, 84], [0, 1], { extrapolateRight: "clamp" }) }}>
            <div style={{ fontSize: 9, color: "#5eead4", fontFamily: MONO, marginBottom: 6 }}>
              [3] 4200 rows × 6 columns
            </div>
            <ChartOutput grow={interpolate(t, [84, 128], [0, 1.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
          </div>
        )}
      </div>
      <Pointer
        x={interpolate(t, [0, 46, 70, 132], [430, 250, 96, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        y={interpolate(t, [0, 46, 70, 132], [90, 150, 196, 240], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </div>
  );
};

// Take 2 — pushed in on the chart while the presenter walks through a bar.
const ShotChart = ({ t }) => {
  const hovered = t < 34 ? -1 : Math.min(5, Math.floor((t - 34) / 26));
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1220", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <ChartOutput grow={1.6} hovered={hovered} big />
      <Pointer
        x={interpolate(t, [0, 34, 60, 112], [420, 300, 316, 372], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        y={interpolate(t, [0, 34, 60, 112], [280, 196, 172, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </div>
  );
};

// Take 3 — back out to the full editor, next cell being typed.
const ShotSplit = ({ t }) => {
  const typed = Math.min(CODE.length, Math.floor(t / 22));
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0d1220", display: "flex", flexDirection: "column" }}>
      <WindowChrome label="analysis.ipynb — edited" />
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ flex: 1 }}>
          <CodeBlock scale={1.5} typedTokens={typed} caretOn={Math.floor(t / 9) % 2 === 0} />
        </div>
        <div style={{ width: 240, padding: 16, display: "flex", alignItems: "center" }}>
          <ChartOutput grow={1.6} />
        </div>
      </div>
      <Pointer
        x={interpolate(t, [0, 60, 160], [180, 210, 236], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        y={interpolate(t, [0, 60, 160], [120, 168, 182], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </div>
  );
};

// Presenter inset. Abstract, warmly lit, and always drifting slightly — a
// perfectly still human is the fastest way to read as fake.
const Webcam = ({ t }) => {
  const sway = Math.sin(t / 38) * 2.4;
  const bob = Math.sin(t / 27) * 1.6;
  return (
    <div
      style={{
        position: "absolute",
        right: 14,
        bottom: 52,
        width: 78,
        height: 78,
        borderRadius: "50%",
        overflow: "hidden",
        border: "2px solid rgba(255,255,255,0.85)",
        boxShadow: "0 8px 20px -6px rgba(0,0,0,0.7)",
        background: "linear-gradient(160deg, #4c3a2f 0%, #2a2230 55%, #1c1a2c 100%)",
      }}
    >
      {/* Shoulders first, head on top — a classic avatar silhouette. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 56,
          width: 66,
          height: 40,
          marginLeft: -33,
          borderRadius: "33px 33px 0 0",
          background: "linear-gradient(150deg, #35415f, #232c42)",
          transform: `translate(${sway * 0.5}px, 0)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 17,
          width: 30,
          height: 32,
          marginLeft: -15,
          borderRadius: "50%",
          background: "linear-gradient(150deg, #c2926a, #8a5f43)",
          transform: `translate(${sway}px, ${bob}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(70% 60% at 30% 25%, rgba(255,214,170,0.35), transparent 70%)",
        }}
      />
    </div>
  );
};

// Sensor noise + a slight exposure wobble. Cheap, and it does most of the work
// of making flat vector shapes stop looking like flat vector shapes.
const Grain = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.13, mixBlendMode: "overlay" }}>
    <svg width={160} height={90} style={{ display: "block", transform: "scale(4)", transformOrigin: "0 0" }}>
      <filter id="lessonGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed={Math.floor(t) % 90} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={160} height={90} filter="url(#lessonGrain)" />
    </svg>
  </div>
);

export const VideoPlayer = ({ enter = 1, playProgress = 0, playbackTime = 0 }) => {
  const t = playbackTime;

  const titleFade = interpolate(t, [0, 12, 58, 74], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Controls behave like a real player: shown on play, auto-hidden after a beat.
  const controlsFade = interpolate(t, [0, 8, 88, 104], [1, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const seconds = START_SECONDS + t / 30;
  const played = Math.min(1, seconds / TOTAL_SECONDS);
  const exposure = 1 + Math.sin(t / 15) * 0.012;

  return (
    <div
      style={{
        width: VIDEO_WIDTH,
        height: VIDEO_HEIGHT,
        borderRadius: 18,
        overflow: "hidden",
        position: "relative",
        background: "#0d1220",
        boxShadow:
          "0 40px 80px -30px rgba(15, 23, 42, 0.55), 0 10px 30px -10px rgba(99, 102, 241, 0.3)",
        transform: `scale(${enter})`,
        opacity: enter,
        fontFamily: FONT,
        filter: `brightness(${exposure})`,
      }}
    >
      {t < CUT_1 ? (
        <ShotCode t={t} />
      ) : t < CUT_2 ? (
        <ShotChart t={t - CUT_1} />
      ) : (
        <ShotSplit t={t - CUT_2} />
      )}

      <Webcam t={t} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(80% 80% at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <Grain t={t} />

      {/* Lower third, so it never sits on top of the code being demonstrated. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 46,
          padding: "26px 20px 12px",
          opacity: titleFade,
          background: "linear-gradient(to top, rgba(0,0,0,0.72), transparent)",
        }}
      >
        <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: 2, color: "#a5b4fc", textTransform: "uppercase" }}>
          Lesson 1 · Intro
        </div>
        <div
          style={{
            fontSize: 19,
            fontWeight: 700,
            marginTop: 3,
            color: "#f8fafc",
            textShadow: "0 2px 10px rgba(0,0,0,0.8)",
          }}
        >
          What is Data Analysis?
        </div>
      </div>

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

      {/* Player chrome */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: 10,
          paddingTop: 26,
          background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)",
          opacity: controlsFade,
        }}
      >
        <div style={{ position: "relative", height: 3, margin: "0 14px 9px" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.28)" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${Math.min(100, played * 100 + 14)}%`,
              background: "rgba(255,255,255,0.45)",
            }}
          />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${played * 100}%`, background: "#ef4444" }} />
          <div
            style={{
              position: "absolute",
              left: `${played * 100}%`,
              top: -3.5,
              width: 10,
              height: 10,
              marginLeft: -5,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 14px", color: "#fff" }}>
          <PlayIcon size={14} color="white" fill="white" />
          <Glyph d="M4 8h4l5-4v16l-5-4H4z" />
          <span style={{ fontSize: 11, fontWeight: 500, fontVariantNumeric: "tabular-nums", opacity: 0.95 }}>
            {formatTime(seconds)} / {formatTime(TOTAL_SECONDS)}
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, fontWeight: 700, border: "1px solid rgba(255,255,255,0.6)", borderRadius: 3, padding: "0 3px" }}>
            CC
          </span>
          <Glyph d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.4 4a8.4 8.4 0 01-.1 1.2l2 1.6-2 3.4-2.4-1a8 8 0 01-2 1.2l-.4 2.6h-4l-.4-2.6a8 8 0 01-2-1.2l-2.4 1-2-3.4 2-1.6a8.4 8.4 0 010-2.4l-2-1.6 2-3.4 2.4 1a8 8 0 012-1.2L9.5 2h4l.4 2.6a8 8 0 012 1.2l2.4-1 2 3.4-2 1.6c.06.4.1.8.1 1.2z" />
          <Glyph d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke />
        </div>
      </div>
    </div>
  );
};

const Glyph = ({ d, stroke = false }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" style={{ opacity: 0.9 }}>
    <path
      d={d}
      fill={stroke ? "none" : "#fff"}
      stroke={stroke ? "#fff" : "none"}
      strokeWidth={stroke ? 2 : 0}
      strokeLinecap="round"
    />
  </svg>
);

const formatTime = (sec) => {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};
