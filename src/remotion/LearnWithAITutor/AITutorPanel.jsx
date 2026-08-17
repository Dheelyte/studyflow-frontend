import { ZapIcon } from "../icons";

export const TUTOR_WIDTH = 520;

export const FULL_EXPLANATION =
  "Data Analysis is the process of inspecting and modelling data to uncover patterns and guide decisions. Here, raw numbers become a story you can actually act on.";

export const FOLLOW_UP = "Can you give me a real example?";

export const TUTOR_REPLY =
  "Say a shop logs every sale. Analysis is what turns that raw log into “Tuesdays are dead, stop staffing them”.";

// Message slots are always rendered and always occupy their space, so the
// layout never reflows when the follow-up and reply arrive — the cursor and
// the camera can both be aimed at fixed coordinates.
const HEADER_BOTTOM = 100;
const EXPLANATION = { y: HEADER_BOTTOM, h: 96 };
const BUBBLE = { y: 212, h: 42 };
const REPLY = { y: 270, h: 84 };
const CHAT_BOTTOM = 400;

export const TUTOR_EXPLANATION = EXPLANATION;
export const TUTOR_BUBBLE = BUBBLE;
export const TUTOR_REPLY_BLOCK = REPLY;
export const TUTOR_INPUT = { x: TUTOR_WIDTH / 2, y: 440 };
export const TUTOR_SEND = { x: TUTOR_WIDTH - 46, y: 440 };
export const TUTOR_HEIGHT = 488;

const FONT = '"Google Sans", "Inter", sans-serif';

const Caret = ({ visible }) => (
  <span
    style={{
      display: "inline-block",
      width: 2,
      height: 18,
      background: "#6366f1",
      marginLeft: 2,
      verticalAlign: "middle",
      opacity: visible ? 1 : 0,
      borderRadius: 1,
    }}
  />
);

const SendArrow = ({ color = "#ffffff" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M4 12h14M12 5l7 7-7 7"
      stroke={color}
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const AITutorPanel = ({
  enter = 1,
  charsShown = 0,
  caretVisible = true,
  loadingDots = 0,
  showLoading = true,
  followUpTyped = "",
  bubbleOpacity = 0,
  replyChars = 0,
  replyThinking = false,
  replyDots = 0,
  sendScale = 1,
  sendActive = false,
}) => {
  const typed = FULL_EXPLANATION.slice(0, charsShown);
  const reply = TUTOR_REPLY.slice(0, replyChars);

  return (
    <div
      style={{
        width: TUTOR_WIDTH,
        height: TUTOR_HEIGHT,
        background: "white",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        borderRadius: 18,
        padding: 24,
        boxShadow:
          "0 30px 60px -20px rgba(99, 102, 241, 0.35), 0 10px 30px -10px rgba(0,0,0,0.08)",
        fontFamily: FONT,
        transform: `translateY(${(1 - enter) * 24}px) scale(${0.96 + 0.04 * enter})`,
        opacity: enter,
        transformOrigin: "top right",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          paddingBottom: 16,
          marginBottom: 16,
          borderBottom: "1px solid rgba(99, 102, 241, 0.08)",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZapIcon size={22} color="#6366f1" fill="#6366f1" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>AI Tutor</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Paused at 0:42 - explaining this section
          </div>
        </div>
      </div>

      {/* Chat area — fixed height, slots at fixed offsets. */}
      <div style={{ position: "relative", height: CHAT_BOTTOM - HEADER_BOTTOM }}>
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: EXPLANATION.h,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#1f2937",
          }}
        >
          {showLoading && charsShown === 0 ? (
            <LoadingDots progress={loadingDots} />
          ) : (
            <span>
              {typed}
              <Caret visible={charsShown < FULL_EXPLANATION.length && caretVisible} />
            </span>
          )}
        </div>

        {/* The learner's follow-up, sent back to the tutor. */}
        <div
          style={{
            position: "absolute",
            top: BUBBLE.y - HEADER_BOTTOM,
            right: 0,
            maxWidth: 360,
            opacity: bubbleOpacity,
            transform: `translateY(${(1 - bubbleOpacity) * 10}px)`,
            background: "linear-gradient(135deg, #6366f1, #4f46e5)",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 500,
            padding: "11px 16px",
            borderRadius: "16px 16px 4px 16px",
            boxShadow: "0 12px 26px -10px rgba(79,70,229,0.65)",
          }}
        >
          {FOLLOW_UP}
        </div>

        <div
          style={{
            position: "absolute",
            top: REPLY.y - HEADER_BOTTOM,
            left: 0,
            right: 0,
            minHeight: REPLY.h,
            fontSize: 16,
            lineHeight: 1.6,
            color: "#1f2937",
          }}
        >
          {replyThinking ? (
            <LoadingDots progress={replyDots} />
          ) : replyChars > 0 ? (
            <span>
              {reply}
              <Caret visible={replyChars < TUTOR_REPLY.length && caretVisible} />
            </span>
          ) : null}
        </div>
      </div>

      {/* Composer */}
      <div
        style={{
          position: "absolute",
          left: 24,
          right: 24,
          top: TUTOR_INPUT.y - 24,
          height: 48,
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid rgba(99,102,241,0.22)",
          borderRadius: 12,
          padding: "0 8px 0 16px",
          background: "#f9fafb",
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: 15,
            color: followUpTyped.length > 0 ? "#111827" : "#9ca3af",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {followUpTyped.length > 0 ? (
            <>
              {followUpTyped}
              <Caret visible={caretVisible} />
            </>
          ) : (
            "Ask a follow-up…"
          )}
        </div>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: sendActive ? "#6366f1" : "rgba(99,102,241,0.14)",
            transform: `scale(${sendScale})`,
            boxShadow: sendActive
              ? "0 10px 22px -8px rgba(99,102,241,0.7)"
              : "none",
          }}
        >
          <SendArrow color={sendActive ? "#ffffff" : "#6366f1"} />
        </div>
      </div>
    </div>
  );
};

const LoadingDots = ({ progress = 0 }) => {
  const dots = [0, 1, 2];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, height: 30, paddingTop: 8 }}>
      {dots.map((i) => {
        const phase = (progress + i * 0.33) % 1;
        const scale = 0.6 + Math.abs(Math.sin(phase * Math.PI)) * 0.8;
        const opacity = 0.4 + Math.abs(Math.sin(phase * Math.PI)) * 0.6;
        return (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#6366f1",
              transform: `scale(${scale})`,
              opacity,
            }}
          />
        );
      })}
      <span style={{ marginLeft: 8, fontSize: 14, color: "#6b7280" }}>Thinking…</span>
    </div>
  );
};
