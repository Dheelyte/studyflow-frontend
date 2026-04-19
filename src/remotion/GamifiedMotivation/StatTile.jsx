export const TILE_WIDTH = 240;
export const TILE_HEIGHT = 112;

export const StatTile = ({
  icon,
  iconColor,
  iconBg,
  value,
  label,
  reveal = 1,
  pulse = 0,
}) => {
  const baseShadow = "0 20px 40px -20px rgba(15, 23, 42, 0.18), 0 6px 18px rgba(15, 23, 42, 0.05)";
  const pulseShadow = pulse > 0
    ? `, 0 0 ${24 + pulse * 22}px ${iconColor}${Math.round(40 + pulse * 50).toString(16).padStart(2, "0")}`
    : "";

  return (
    <div
      style={{
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        background: "white",
        border: "1px solid rgba(99, 102, 241, 0.1)",
        borderRadius: 16,
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        boxShadow: `${baseShadow}${pulseShadow}`,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 26}px) scale(${0.94 + reveal * 0.06 + pulse * 0.03})`,
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: pulse > 0 ? `0 0 ${pulse * 16}px ${iconColor}` : "none",
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: -0.5,
            lineHeight: 1.1,
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#6b7280",
            letterSpacing: 0.4,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
