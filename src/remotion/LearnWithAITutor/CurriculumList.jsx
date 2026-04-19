import { VideoIcon, ClockIcon, ChevronUp } from "../icons";

const TOPICS = [
  {
    title: "What is Data Analysis?",
    description: "Understand the core idea of turning raw numbers into insight.",
    xp: "+11 XP",
    nextUp: true,
  },
  {
    title: "Types of Data & Variables",
    description: "Categorical, numerical, ordinal — know what you're working with.",
    xp: "+11 XP",
  },
  {
    title: "Descriptive Statistics",
    description: "Mean, median, variance, and reading a distribution at a glance.",
    xp: "+11 XP",
  },
  {
    title: "Visualising with Charts",
    description: "When to reach for a bar, a line, a scatter, or a heatmap.",
    xp: "+11 XP",
  },
];

export const PANEL_WIDTH = 760;
export const TOPIC_HEIGHT = 96;
export const TOPIC_GAP = 14;
export const FIRST_TOPIC_Y_OFFSET = 138;

export const CurriculumList = ({
  slideProgress = 1,
  topicReveals = [1, 1, 1, 1],
  highlightIndex = -1,
  highlightPulse = 0,
  panelOpacity = 1,
}) => {
  const translateX = (1 - slideProgress) * 900;

  return (
    <div
      style={{
        transform: `translateX(${translateX}px)`,
        opacity: panelOpacity,
        width: PANEL_WIDTH,
        background: "white",
        border: "1px solid rgba(99, 102, 241, 0.12)",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 40px 80px -30px rgba(99, 102, 241, 0.3), 0 10px 30px -10px rgba(0,0,0,0.08)",
        fontFamily: '"Google Sans", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 18,
          marginBottom: 18,
          borderBottom: "1px solid rgba(99, 102, 241, 0.08)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: "#6366f1",
              fontWeight: 700,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Module 1
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>
            Foundations of Data Analysis
          </div>
        </div>
        <ChevronUp size={22} color="#6b7280" />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "0 4px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
          Intro Lesson
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <ClockIcon size={14} color="#6b7280" />
          1 hour
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: TOPIC_GAP }}>
        {TOPICS.map((topic, i) => {
          const reveal = topicReveals[i] ?? 0;
          const isHighlighted = highlightIndex === i;
          const pulseOpacity = isHighlighted ? highlightPulse : 0;

          const borderColor = topic.nextUp || isHighlighted
            ? "#6366f1"
            : "rgba(99, 102, 241, 0.2)";
          const background = isHighlighted
            ? `rgba(99, 102, 241, ${0.12 + pulseOpacity * 0.12})`
            : topic.nextUp
            ? "rgba(99, 102, 241, 0.1)"
            : "rgba(99, 102, 241, 0.05)";

          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "16px 18px",
                background,
                border: `${topic.nextUp || isHighlighted ? 2 : 1}px solid ${borderColor}`,
                borderRadius: 12,
                boxShadow:
                  (topic.nextUp || isHighlighted)
                    ? `0 0 ${15 + pulseOpacity * 25}px rgba(99, 102, 241, ${0.2 + pulseOpacity * 0.4})`
                    : "none",
                transform: `translateY(${(1 - reveal) * 28}px)`,
                opacity: reveal,
                height: TOPIC_HEIGHT - 2,
                overflow: "visible",
              }}
            >
              {topic.nextUp && (
                <div
                  style={{
                    position: "absolute",
                    top: -22,
                    right: 12,
                    background: "#6366f1",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "4px 10px",
                    borderRadius: "6px 6px 0 0",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Next Up
                </div>
              )}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(99, 102, 241, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#6366f1",
                  flexShrink: 0,
                  marginTop: 4,
                }}
              >
                <VideoIcon size={20} color="#6366f1" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: "#111827",
                    marginBottom: 2,
                  }}
                >
                  {topic.title}
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 13,
                    lineHeight: 1.4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {topic.description}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  display: "flex",
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#d97706",
                    background: "rgba(217, 119, 6, 0.1)",
                    padding: "4px 8px",
                    borderRadius: "0 0 0 12px",
                    borderBottom: "1px solid rgba(217, 119, 6, 0.2)",
                    borderLeft: "1px solid rgba(217, 119, 6, 0.2)",
                  }}
                >
                  {topic.xp}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#6366f1",
                    background: "rgba(99, 102, 241, 0.1)",
                    padding: "4px 8px",
                    borderRadius: "0 12px 0 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                  }}
                >
                  <VideoIcon size={10} color="#6366f1" />
                  Video
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
