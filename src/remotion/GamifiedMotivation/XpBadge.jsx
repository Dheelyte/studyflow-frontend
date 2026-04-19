import { StarIcon } from "../icons";

export const XpBadge = ({ x, y, float = 0, opacity = 1, label = "+50 XP" }) => {
  const translateY = -float * 80;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${0.7 + opacity * 0.3})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 14px",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white",
          borderRadius: 999,
          fontFamily: '"Google Sans", "Inter", sans-serif',
          fontWeight: 800,
          fontSize: 14,
          letterSpacing: 0.2,
          boxShadow: "0 12px 24px -6px rgba(59, 130, 246, 0.55), 0 0 20px rgba(99, 102, 241, 0.4)",
          whiteSpace: "nowrap",
        }}
      >
        <StarIcon size={14} color="white" fill="white" />
        {label}
      </div>
    </div>
  );
};
