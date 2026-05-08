import { UsersIcon } from "../icons";

export const HEADER_WIDTH = 440;
export const HEADER_HEIGHT = 88;
export const JOIN_BUTTON_OFFSET_X = 385;
export const JOIN_BUTTON_OFFSET_Y = HEADER_HEIGHT / 2;

export const CommunityHeader = ({
  opacity = 1,
  memberBump = 0,
  joined = false,
  joinScale = 1,
  joinFlash = 0,
}) => {
  const members = 2847 + (joined ? 1 : 0) + Math.round(memberBump * 3);
  return (
    <div
      style={{
        width: HEADER_WIDTH,
        height: HEADER_HEIGHT,
        background:
          "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.08))",
        border: "1px solid rgba(99, 102, 241, 0.18)",
        borderRadius: 16,
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: '"Google Sans", "Inter", sans-serif',
        opacity,
        transform: `translateY(${(1 - opacity) * 16}px)`,
        boxShadow: "0 18px 40px -22px rgba(99, 102, 241, 0.28)",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          boxShadow: "0 10px 24px -8px rgba(99, 102, 241, 0.55)",
          flexShrink: 0,
        }}
      >
        DA
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap" }}>
            Data Analysis
          </span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.6,
              textTransform: "uppercase",
              color: "#10b981",
              background: "rgba(16, 185, 129, 0.12)",
              padding: "3px 8px",
              borderRadius: 6,
            }}
          >
            Community
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#6b7280",
            fontWeight: 500,
          }}
        >
          <UsersIcon size={14} color="#6b7280" />
          <span>{members.toLocaleString()} members</span>
          <span style={{ color: "#d1d5db" }}>·</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "#10b981",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
            />
            142 online
          </span>
        </div>
      </div>

      <div
        style={{
          padding: "8px 16px",
          background: joined ? "#4f46e5" : "#6366f1",
          color: "white",
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 700,
          boxShadow: `0 ${10 + joinFlash * 14}px ${24 + joinFlash * 18}px -8px rgba(99, 102, 241, ${0.5 + joinFlash * 0.3})`,
          transform: `scale(${joinScale})`,
          filter: `brightness(${1 + joinFlash * 0.15})`,
        }}
      >
        {joined ? "Joined" : "Join"}
      </div>
    </div>
  );
};
