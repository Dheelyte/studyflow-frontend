import { HeartIcon, MessageSquareIcon } from "../icons";

export const POST_WIDTH = 440;

const POST_AUTHOR = "John Musa";
const POST_INITIALS = "AR";
const POST_AVATAR_GRADIENT =
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";

export const PostCard = ({
  typedContent = "",
  caretVisible = true,
  isTyping = false,
  likes = 0,
  liked = false,
  likeScale = 1,
  commentCount = 0,
  commentIconBounce = 0,
  opacity = 1,
  lift = 0,
  children,
}) => {
  return (
    <div
      style={{
        width: POST_WIDTH,
        background: "white",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 28px 60px -24px rgba(15, 23, 42, 0.25), 0 8px 24px -8px rgba(15, 23, 42, 0.06)",
        fontFamily: '"Google Sans", "Inter", sans-serif',
        opacity,
        transform: `translateY(${lift}px)`,
      }}
    >
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: POST_AVATAR_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0,
            boxShadow: "0 6px 16px -6px rgba(79, 172, 254, 0.55)",
          }}
        >
          {POST_INITIALS}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
            {POST_AUTHOR}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Just now · Data Analysis</div>
        </div>
      </div>

      <div
        style={{
          fontSize: 16,
          lineHeight: 1.6,
          color: "#111827",
          marginBottom: 20,
          minHeight: 56,
        }}
      >
        {typedContent}
        {isTyping && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 18,
              background: "#6366f1",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              opacity: caretVisible ? 1 : 0,
              borderRadius: 1,
            }}
          />
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: 28,
          borderTop: "1px solid rgba(99, 102, 241, 0.08)",
          paddingTop: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: liked ? "#ef4444" : "#6b7280",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              transform: `scale(${likeScale})`,
              transformOrigin: "center",
            }}
          >
            <HeartIcon
              size={20}
              color={liked ? "#ef4444" : "#6b7280"}
              fill={liked ? "#ef4444" : "none"}
            />
          </span>
          <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 24 }}>
            {likes}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            color: "#6b7280",
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              transform: `translateY(${-commentIconBounce * 4}px) scale(${1 + commentIconBounce * 0.15})`,
              color: commentIconBounce > 0 ? "#6366f1" : "#6b7280",
            }}
          >
            <MessageSquareIcon
              size={20}
              color={commentIconBounce > 0 ? "#6366f1" : "#6b7280"}
            />
          </span>
          <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 18 }}>
            {commentCount}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
};
