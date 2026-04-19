import { TrophyIcon, XIcon } from "../icons";

export const MODAL_WIDTH = 640;
export const MODAL_HEIGHT = 560;

export const QuizModal = ({
  enter = 1,
  progress = 0,
  children,
  hideProgressBar = false,
}) => {
  return (
    <div
      style={{
        width: MODAL_WIDTH,
        height: MODAL_HEIGHT,
        background: "white",
        borderRadius: 20,
        border: "1px solid rgba(99, 102, 241, 0.1)",
        boxShadow: "0 40px 80px -20px rgba(15, 23, 42, 0.35), 0 0 60px rgba(99, 102, 241, 0.15)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transform: `translateY(${(1 - enter) * 40}px) scale(${0.85 + 0.15 * enter})`,
        opacity: enter,
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          padding: "20px 24px",
          borderBottom: "1px solid rgba(99, 102, 241, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(99, 102, 241, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TrophyIcon size={22} color="#eab308" fill="#fde68a" />
          <span style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>
            Foundations of Data Analysis Quiz
          </span>
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            background: "transparent",
          }}
        >
          <XIcon size={18} color="#6b7280" />
        </div>
      </div>

      {!hideProgressBar && (
        <div
          style={{
            padding: "14px 32px 0 32px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 6,
              background: "rgba(99, 102, 241, 0.12)",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                background: "linear-gradient(90deg, #10b981, #34d399)",
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          padding: "28px 32px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
};
