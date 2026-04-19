import { TrophyIcon } from "../icons";

export const QUIZ_CARD_WIDTH = 640;
export const QUIZ_CARD_HEIGHT = 88;

export const QuizCard = ({
  moduleTitle = "Foundations of Data Analysis",
  pressScale = 1,
  hoverGlow = 0,
  fade = 1,
}) => {
  return (
    <div
      style={{
        width: QUIZ_CARD_WIDTH,
        minHeight: QUIZ_CARD_HEIGHT,
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 22px",
        background: "linear-gradient(135deg, rgba(255, 215, 0, 0.18), rgba(255, 165, 0, 0.08))",
        border: "1px solid rgba(255, 215, 0, 0.45)",
        borderRadius: 14,
        boxShadow: `0 10px 30px -10px rgba(234, 179, 8, ${0.25 + hoverGlow * 0.3}), 0 0 ${hoverGlow * 40}px rgba(99, 102, 241, ${hoverGlow * 0.4})`,
        transform: `scale(${pressScale})`,
        opacity: fade,
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -22,
          right: 16,
          background: "#6366f1",
          color: "white",
          fontSize: 10,
          fontWeight: 700,
          padding: "4px 12px",
          borderRadius: "6px 6px 0 0",
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Next Up
      </div>

      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: "rgba(255, 215, 0, 0.25)",
          color: "#eab308",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <TrophyIcon size={22} color="#eab308" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
          Ready to test your knowledge?
        </div>
        <div style={{ fontSize: 14, color: "#6b7280" }}>
          Take the {moduleTitle} Quiz
        </div>
      </div>
    </div>
  );
};
