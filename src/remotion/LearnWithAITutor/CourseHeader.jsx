import { PlayIcon, ZapIcon, ShareIcon } from "../icons";

export const CourseHeader = ({
  imageEnter = 1,
  titleEnter = 1,
  descEnter = 1,
  ctaEnter = 1,
  float = 0,
  scale = 1,
  opacity = 1,
  offsetX = 0,
  showProgress = false,
}) => {
  return (
    <div
      style={{
        transform: `translateX(${offsetX}px) scale(${scale})`,
        transformOrigin: "center top",
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        padding: "40px 24px 24px 24px",
        fontFamily: '"Google Sans", "Inter", sans-serif',
        color: "#111827",
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          borderRadius: 24,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 20px 50px -10px rgba(99, 102, 241, 0.5)",
          transform: `translateY(${(1 - imageEnter) * -60 + float}px) scale(${imageEnter})`,
          opacity: imageEnter,
        }}
      >
        <ZapIcon size={64} color="white" fill="white" />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          maxWidth: 800,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #111827 0%, #6b7280 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            transform: `translateY(${(1 - titleEnter) * 30}px)`,
            opacity: titleEnter,
            textAlign: "center",
          }}
        >
          Data Analysis
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 20,
            color: "#6b7280",
            lineHeight: 1.6,
            textAlign: "center",
            maxWidth: 680,
            transform: `translateY(${(1 - descEnter) * 20}px)`,
            opacity: descEnter,
          }}
        >
          Master the art of turning raw data into clear insights - statistics,
          visualisation, and storytelling with numbers.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          transform: `translateY(${(1 - ctaEnter) * 20}px)`,
          opacity: ctaEnter,
        }}
      >
        <button
          style={{
            padding: "16px 40px",
            background: "#6366f1",
            color: "white",
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 20,
            fontWeight: 700,
            border: "none",
            boxShadow: "0 12px 28px -6px rgba(79, 70, 229, 0.5)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <PlayIcon size={22} color="white" fill="white" />
          Start Learning
        </button>
        <button
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "white",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            color: "#6b7280",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <ShareIcon size={22} color="#6b7280" />
        </button>
      </div>

      {showProgress && (
        <div style={{ width: 420, marginTop: 4 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              color: "#6b7280",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            <span>Course Progress</span>
            <span>0% completed</span>
          </div>
          <div
            style={{
              width: "100%",
              height: 8,
              background: "#eef0ff",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <div style={{ width: "0%", height: "100%", background: "#6366f1" }} />
          </div>
        </div>
      )}
    </div>
  );
};
