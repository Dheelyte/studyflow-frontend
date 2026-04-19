export const Comment = ({
  author,
  initials,
  avatarGradient,
  time,
  content,
  reveal = 1,
}) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        paddingLeft: 18,
        paddingTop: 12,
        paddingBottom: 12,
        borderLeft: "2px solid rgba(99, 102, 241, 0.18)",
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 14}px)`,
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: avatarGradient,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          flexShrink: 0,
          boxShadow: "0 4px 12px -4px rgba(15, 23, 42, 0.25)",
        }}
      >
        {initials}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <div style={{ fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: "#111827" }}>{author}</span>
          <span style={{ color: "#9ca3af", fontWeight: 400 }}> · {time}</span>
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.55, color: "#374151" }}>
          {content}
        </div>
      </div>
    </div>
  );
};
