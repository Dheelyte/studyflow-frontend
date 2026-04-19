import { CheckCircleIcon, VideoIcon, ChevronUp } from "../icons";
import { QuizCard, QUIZ_CARD_WIDTH } from "./QuizCard";

export const MODULE_WIDTH = 720;

export const CourseContext = ({
  opacity = 1,
  scale = 1,
  quizCardPress = 1,
  quizCardGlow = 0,
  quizCardClicked = false,
}) => {
  const completedTopics = [
    "What is Data Analysis?",
    "Types of Data & Variables",
    "Descriptive Statistics",
  ];

  return (
    <div
      style={{
        width: MODULE_WIDTH,
        background: "white",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 30px 70px -30px rgba(99, 102, 241, 0.25), 0 10px 30px -10px rgba(0,0,0,0.08)",
        fontFamily: '"Google Sans", "Inter", sans-serif',
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 16,
          marginBottom: 16,
          borderBottom: "1px solid rgba(99, 102, 241, 0.08)",
          background: "rgba(16, 185, 129, 0.04)",
          borderLeft: "4px solid #10b981",
          margin: "-28px -28px 16px -28px",
          padding: "20px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
            Module 1 · Foundations of Data Analysis
          </div>
          <CheckCircleIcon size={20} color="#10b981" />
        </div>
        <ChevronUp size={22} color="#6b7280" />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {completedTopics.map((title, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 16px",
              background: "rgba(16, 185, 129, 0.06)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 7,
                background: "rgba(16, 185, 129, 0.15)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <VideoIcon size={16} color="#10b981" />
            </div>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {title}
            </div>
            <CheckCircleIcon size={18} color="#10b981" />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <QuizCard
          pressScale={quizCardPress}
          hoverGlow={quizCardGlow}
        />
      </div>
    </div>
  );
};
