import { XpBadge } from "../GamifiedMotivation/XpBadge";
import { FlameIcon, ZapIcon } from "../icons";

const FONT = '"Google Sans", "Inter", sans-serif';

const bob = (frame, phase, amp = 11, period = 34) =>
  Math.sin((frame + phase) / period) * amp;

// Opacity and float live on this wrapper, never on the Layer above it — a
// Layer with opacity < 1 would flatten the whole 3D stack.
const AccentWrap = ({ frame, phase, tilt, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transformStyle: "preserve-3d",
      transform: `translateY(${bob(frame, phase)}px) rotateY(${tilt}deg)`,
    }}
  >
    {children}
  </div>
);

export const XpAccent = ({ frame, x, y }) => (
  <AccentWrap frame={frame} phase={0} tilt={8}>
    <XpBadge x={x} y={y} float={0} opacity={1} label="+50 XP" />
  </AccentWrap>
);

export const StreakAccent = ({ frame, x, y }) => (
  <AccentWrap frame={frame} phase={46} tilt={7}>
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        gap: 9,
        padding: "11px 18px",
        borderRadius: 999,
        background: "linear-gradient(135deg, #f59e0b, #f97316)",
        color: "#ffffff",
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 23,
        whiteSpace: "nowrap",
        boxShadow: "0 20px 44px -12px rgba(249,115,22,0.75)",
      }}
    >
      <FlameIcon size={23} color="#ffffff" fill="#ffffff" />
      13 day streak
    </div>
  </AccentWrap>
);

export const BoltAccent = ({ frame, x, y }) => (
  <AccentWrap frame={frame} phase={94} tilt={10}>
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 82,
        height: 82,
        borderRadius: "50%",
        background:
          "linear-gradient(150deg, rgba(129,140,248,0.30), rgba(79,70,229,0.16))",
        border: "1px solid rgba(165,180,252,0.42)",
        boxShadow: "0 24px 50px -14px rgba(79,70,229,0.85)",
      }}
    >
      <ZapIcon size={38} color="#c7d2fe" fill="#c7d2fe" />
    </div>
  </AccentWrap>
);
