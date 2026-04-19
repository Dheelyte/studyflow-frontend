import { CheckCircleIcon } from "../icons";

export const QUESTION_TEXT = "What is the primary goal of data analysis?";
export const OPTIONS = [
  { id: "a", text: "Storing data in large databases for later retrieval" },
  { id: "b", text: "Uncovering insights that guide real decisions" },
  { id: "c", text: "Collecting as much raw data as possible" },
  { id: "d", text: "Encrypting sensitive information at rest" },
];
export const CORRECT_ID = "b";

const OPTION_HEIGHT = 56;
const OPTION_GAP = 12;
export const OPTIONS_START_Y = 240;
export const OPTIONS_LEFT = 56;
export const OPTION_WIDTH = 576;

export const getOptionCenter = (index) => {
  const y = OPTIONS_START_Y + index * (OPTION_HEIGHT + OPTION_GAP) + OPTION_HEIGHT / 2;
  const x = OPTIONS_LEFT + OPTION_WIDTH / 2;
  return { x, y };
};

export const QuestionView = ({
  questionChars = QUESTION_TEXT.length,
  optionReveals = [1, 1, 1, 1],
  selectedId = null,
  showCorrection = false,
  nextButtonHighlight = 0,
  caretVisible = true,
}) => {
  const typedQuestion = QUESTION_TEXT.slice(0, questionChars);
  const isTyping = questionChars < QUESTION_TEXT.length;

  return (
    <div style={{ textAlign: "left", display: "flex", flexDirection: "column", flex: 1 }}>
      <div
        style={{
          fontSize: 11,
          color: "#9ca3af",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        Question 1 of 10
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: 22,
          lineHeight: 1.45,
          fontWeight: 700,
          color: "#111827",
          marginBottom: 24,
          minHeight: 64,
        }}
      >
        {typedQuestion}
        {isTyping && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 22,
              background: "#6366f1",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              opacity: caretVisible ? 1 : 0,
              borderRadius: 1,
            }}
          />
        )}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: OPTION_GAP }}>
        {OPTIONS.map((opt, i) => {
          const reveal = optionReveals[i] ?? 0;
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.id === CORRECT_ID;

          let background = "white";
          let borderColor = "rgba(99, 102, 241, 0.2)";
          let color = "#111827";
          let fontWeight = 500;

          if (showCorrection) {
            if (isCorrect) {
              background = "rgba(16, 185, 129, 0.12)";
              borderColor = "#10b981";
              color = "#047857";
              fontWeight = 600;
            } else if (isSelected) {
              background = "rgba(239, 68, 68, 0.12)";
              borderColor = "#ef4444";
              color = "#b91c1c";
            }
          } else if (isSelected) {
            background = "rgba(99, 102, 241, 0.1)";
            borderColor = "#6366f1";
          }

          return (
            <div
              key={opt.id}
              style={{
                position: "relative",
                height: OPTION_HEIGHT,
                padding: "0 20px",
                background,
                border: `1.5px solid ${borderColor}`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color,
                fontSize: 15,
                fontWeight,
                transform: `translateX(${(1 - reveal) * -30}px)`,
                opacity: reveal,
                boxShadow:
                  showCorrection && isCorrect
                    ? "0 0 24px rgba(16, 185, 129, 0.35)"
                    : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background:
                      showCorrection && isCorrect
                        ? "#10b981"
                        : showCorrection && isSelected
                        ? "#ef4444"
                        : "rgba(99, 102, 241, 0.08)",
                    color:
                      showCorrection && (isCorrect || isSelected)
                        ? "white"
                        : "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0,
                    flexShrink: 0,
                  }}
                >
                  {opt.id.toUpperCase()}
                </div>
                <span>{opt.text}</span>
              </div>
              {showCorrection && isCorrect && (
                <CheckCircleIcon size={20} color="#10b981" />
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 20,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          style={{
            padding: "12px 32px",
            background: nextButtonHighlight > 0
              ? `linear-gradient(135deg, #6366f1, #a855f7)`
              : "#e5e7eb",
            color: nextButtonHighlight > 0 ? "white" : "#9ca3af",
            fontSize: 15,
            fontWeight: 700,
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow:
              nextButtonHighlight > 0
                ? `0 10px 24px -6px rgba(99, 102, 241, ${0.5 + nextButtonHighlight * 0.3})`
                : "none",
            transform: `scale(${1 + nextButtonHighlight * 0.02})`,
          }}
        >
          Finish Quiz
        </button>
      </div>
    </div>
  );
};
