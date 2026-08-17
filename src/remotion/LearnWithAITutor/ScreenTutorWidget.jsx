import { ZapIcon } from "../icons";

export const ST_WIDTH = 520;

// Geometry is exported so the scene can aim the cursor at real controls instead
// of hand-tuned magic numbers.
export const ST_SHOT = { x: 20, y: 74, w: 480, h: 236 };
export const ST_CAPTURE_BTN = { x: ST_WIDTH / 2, y: ST_SHOT.y + ST_SHOT.h / 2 };
// Relative to ST_SHOT, not to the widget.
export const ST_REGION = { x: 44, y: 92, w: 196, h: 86 };
export const ST_INPUT = { x: ST_WIDTH / 2, y: 369 };
export const ST_ASK_BTN = { x: 74, y: 459 };
// The streamed answer. minHeight below is pinned to this so the camera can be
// aimed at it before the first character lands.
export const ST_ANSWER_BLOCK = { y: 491, h: 76 };

export const ST_QUESTION = "Why is my chart empty?";
export const ST_ANSWER =
  "Look at line 12 - you filter before converting the column to numeric, so every row drops out. What does df.dtypes say about it?";

const FONT = '"Google Sans", "Inter", sans-serif';
const MONO = '"SF Mono", "Menlo", monospace';

// Deterministic so every render of a given frame is identical.
const CODE_LINES = [
  { indent: 0, tokens: [[38, "#c792ea"], [54, "#82aaff"]] },
  { indent: 0, tokens: [[30, "#c792ea"], [72, "#82aaff"]] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [[46, "#7fdbca"], [88, "#556074"]] },
  { indent: 0, tokens: [[62, "#7fdbca"], [40, "#f78c6c"]] },
  { indent: 1, tokens: [[52, "#82aaff"], [66, "#556074"]] },
  { indent: 1, tokens: [[74, "#7fdbca"]] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [[58, "#c792ea"], [92, "#82aaff"]] },
  { indent: 0, tokens: [[44, "#7fdbca"], [50, "#f78c6c"]] },
];

const CapturedScreen = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "#0b1020",
      display: "flex",
    }}
  >
    <div style={{ flex: 1, padding: "14px 12px", display: "flex", flexDirection: "column", gap: 9 }}>
      {CODE_LINES.map((line, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 12, fontSize: 8, color: "#3d4763", fontFamily: MONO, textAlign: "right" }}>
            {i + 1}
          </span>
          <span style={{ width: line.indent * 14 }} />
          {line.tokens.map(([w, color], t) => (
            <span key={t} style={{ width: w, height: 5, borderRadius: 2, background: color, opacity: 0.85 }} />
          ))}
        </div>
      ))}
    </div>

    {/* The empty chart is the whole reason the learner is stuck. */}
    <div style={{ width: 178, borderLeft: "1px solid rgba(255,255,255,0.07)", padding: 14 }}>
      <div style={{ fontSize: 9, color: "#7b88a6", fontFamily: FONT, marginBottom: 10 }}>
        sales_by_region
      </div>
      <div style={{ position: "relative", height: 132, borderLeft: "1px solid #2b3450", borderBottom: "1px solid #2b3450" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            color: "#4a5570",
            fontFamily: FONT,
          }}
        >
          no data
        </div>
      </div>
    </div>
  </div>
);

export const ScreenTutorWidget = ({
  enter = 1,
  captured = 0,
  flash = 0,
  regionProgress = 0,
  regionLocked = false,
  typedQuestion = "",
  caretVisible = true,
  askScale = 1,
  asking = false,
  answerChars = 0,
}) => {
  const showRegion = regionProgress > 0;
  const answer = ST_ANSWER.slice(0, answerChars);

  return (
    <div
      style={{
        width: ST_WIDTH,
        background: "#ffffff",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        borderRadius: 18,
        padding: 20,
        boxShadow:
          "0 30px 60px -20px rgba(99, 102, 241, 0.40), 0 10px 30px -10px rgba(0,0,0,0.10)",
        fontFamily: FONT,
        transform: `translateY(${(1 - enter) * 30}px) scale(${0.96 + 0.04 * enter})`,
        opacity: enter,
        transformOrigin: "bottom right",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            background: "linear-gradient(135deg, rgba(99,102,241,0.16), rgba(168,85,247,0.16))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZapIcon size={20} color="#6366f1" fill="#6366f1" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Screen tutor</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 1 }}>
            Helping with Data Analysis
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>Sharing</span>
        </div>
      </div>

      {/* Screenshot area */}
      <div
        style={{
          position: "relative",
          height: ST_SHOT.h,
          borderRadius: 12,
          overflow: "hidden",
          border: captured > 0 ? "1px solid #1f2937" : "2px dashed rgba(99,102,241,0.35)",
          background: captured > 0 ? "#0b1020" : "rgba(99,102,241,0.04)",
        }}
      >
        {captured > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: captured }}>
            <CapturedScreen />
          </div>
        )}

        {captured === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "#6366f1",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: 15,
                padding: "12px 22px",
                borderRadius: 99,
                boxShadow: "0 12px 26px -8px rgba(99,102,241,0.65)",
              }}
            >
              Share Your Screen
            </div>
          </div>
        )}

        {showRegion && (
          <div
            style={{
              position: "absolute",
              left: ST_REGION.x,
              top: ST_REGION.y,
              width: ST_REGION.w * regionProgress,
              height: ST_REGION.h * regionProgress,
              border: "2px solid #6366f1",
              borderRadius: 6,
              background: "rgba(99,102,241,0.16)",
              boxShadow: regionLocked ? "0 0 0 9999px rgba(11,16,32,0.45)" : "none",
            }}
          />
        )}

        {flash > 0 && (
          <div style={{ position: "absolute", inset: 0, background: "#ffffff", opacity: flash }} />
        )}
      </div>

      <div style={{ fontSize: 12, color: regionLocked ? "#4f46e5" : "#6b7280", marginTop: 10, height: 16 }}>
        {captured > 0 &&
          (regionLocked
            ? "Focusing on the highlighted area"
            : "Drag over the screenshot to point at what you're stuck on")}
      </div>

      <div
        style={{
          marginTop: 10,
          border: "1px solid rgba(99,102,241,0.20)",
          borderRadius: 11,
          padding: "13px 15px",
          fontSize: 15,
          color: "#111827",
          background: "#f9fafb",
          minHeight: 46,
          display: "flex",
          alignItems: "center",
        }}
      >
        {typedQuestion.length > 0 ? (
          <>
            <span>{typedQuestion}</span>
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 17,
                background: "#6366f1",
                marginLeft: 2,
                opacity: caretVisible ? 1 : 0,
                borderRadius: 1,
              }}
            />
          </>
        ) : (
          <span style={{ color: "#9ca3af" }}>What are you stuck on?</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 18, marginTop: 12, fontSize: 13, color: "#374151" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 600 }}>
          <span
            style={{
              width: 15,
              height: 15,
              borderRadius: "50%",
              border: "2px solid #6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#6366f1" }} />
          </span>
          Give me a hint
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 7, color: "#6b7280" }}>
          <span style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid #d1d5db" }} />
          Just tell me
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
        <div
          style={{
            background: "#6366f1",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: 15,
            padding: "11px 26px",
            borderRadius: 99,
            transform: `scale(${askScale})`,
            boxShadow: "0 12px 26px -8px rgba(99,102,241,0.60)",
          }}
        >
          {asking ? "Thinking…" : "Ask"}
        </div>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>19 of 20 left today</span>
      </div>

      {answerChars > 0 && (
        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(99,102,241,0.10)",
            fontSize: 15,
            lineHeight: 1.55,
            color: "#1f2937",
            minHeight: ST_ANSWER_BLOCK.h - 14,
          }}
        >
          {answer}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 17,
              background: "#6366f1",
              marginLeft: 2,
              verticalAlign: "middle",
              opacity: answerChars < ST_ANSWER.length && caretVisible ? 1 : 0,
              borderRadius: 1,
            }}
          />
        </div>
      )}
    </div>
  );
};
