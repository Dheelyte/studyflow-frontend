import { CheckCircleIcon, TrophyIcon } from "../icons";
import { MODAL_WIDTH, MODAL_HEIGHT } from "./QuizModal";

// The project is shown in the same modal as the quiz, so it inherits the
// modal's box and these are just aliases for the scene's layout maths.
export const PROJECT_WIDTH = MODAL_WIDTH;
export const PROJECT_HEIGHT = MODAL_HEIGHT;

// Layout, in modal-local coordinates. The cursor targets below are derived from
// these, so moving a block moves the cursor with it.
const HEADER_HEIGHT = 64; // 20px padding twice + the 19px title's line box
const BODY_TOP = HEADER_HEIGHT + 28; // + body padding
const BODY_LEFT = 32;
const KICKER_BLOCK = 22; // 11px kicker + its margin
const BRIEF_BLOCK = 106; // three typed lines + its margin
const REQ_HEIGHT = 50;
const REQ_GAP = 10;
const REQ_TOP = BODY_TOP + KICKER_BLOCK + BRIEF_BLOCK;
const LINK_TOP = REQ_TOP + 3 * REQ_HEIGHT + 2 * REQ_GAP + 14;
const LINK_FIELD_TOP = LINK_TOP + 20; // below its label
const LINK_FIELD_HEIGHT = 42;
const SAVE_TOP = LINK_FIELD_TOP + LINK_FIELD_HEIGHT + 14;
const SAVE_HEIGHT = 44;
const SAVE_WIDTH = 162;

// Cursor targets, relative to the modal's top-left.
export const REQ_ROWS = [0, 1, 2].map(
  (i) => REQ_TOP + i * (REQ_HEIGHT + REQ_GAP) + REQ_HEIGHT / 2
);
export const REQ_CHECK_X = BODY_LEFT + 14 + 13; // row padding + half a checkbox
export const LINK_FIELD = {
  x: MODAL_WIDTH / 2,
  y: LINK_FIELD_TOP + LINK_FIELD_HEIGHT / 2,
};
export const SAVE_BTN = {
  x: BODY_LEFT + SAVE_WIDTH / 2,
  y: SAVE_TOP + SAVE_HEIGHT / 2,
};

export const PROJECT_LINK = "github.com/ada/sales-cleanup";

export const PROJECT_BRIEF =
  "Clean the date and amount columns in this module's sales export, then ship one chart that answers a question a shop owner would actually ask.";

export const REQUIREMENTS = [
  "Load the CSV and fix the column types",
  "Handle the missing and duplicate rows",
  "Ship one chart whose title states the finding",
];

const Checkbox = ({ progress }) => (
  <div
    style={{
      width: 26,
      height: 26,
      borderRadius: 8,
      flex: "none",
      border: `2px solid ${progress > 0.5 ? "#6366f1" : "#cbd5e1"}`,
      background: progress > 0.5 ? "#6366f1" : "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${1 + Math.sin(Math.min(1, progress) * Math.PI) * 0.18})`,
    }}
  >
    <div style={{ opacity: progress > 0.5 ? 1 : 0, display: "flex" }}>
      <CheckCircleIcon size={16} color="#ffffff" />
    </div>
  </div>
);

// Body content for the modal: kicker, typed brief, then the checklist that
// fades up once the brief has finished typing , the same beat structure as the
// quiz question and its options.
export const PracticeProject = ({
  briefChars = PROJECT_BRIEF.length,
  reqReveals = [1, 1, 1],
  checks = [0, 0, 0],
  linkTyped = "",
  caretVisible = true,
  saveScale = 1,
  done = 0,
}) => {
  const ticked = checks.filter((c) => c > 0.5).length;
  const brief = PROJECT_BRIEF.slice(0, briefChars);
  const isTyping = briefChars < PROJECT_BRIEF.length;

  return (
    <div style={{ textAlign: "left", display: "flex", flexDirection: "column", flex: 1 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 11,
          color: "#9ca3af",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 8,
          height: 14,
        }}
      >
        <span>{ticked} of 3 requirements</span>
        <span style={{ color: "#d1d5db" }}>·</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "#b45309",
            letterSpacing: 1,
          }}
        >
          <TrophyIcon size={12} color="#b45309" />
          +75 XP
        </span>
      </div>

      {/* The brief carries the beat the question carries in the quiz: bold,
          typed out, with a fixed height so the checklist never shifts. */}
      <div
        style={{
          fontSize: 19,
          lineHeight: 1.5,
          fontWeight: 700,
          color: "#111827",
          height: 88,
          marginBottom: 18,
        }}
      >
        {brief}
        {isTyping && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 20,
              background: "#6366f1",
              marginLeft: 2,
              verticalAlign: "text-bottom",
              borderRadius: 1,
              opacity: caretVisible ? 1 : 0,
            }}
          />
        )}
      </div>

      {/* Self-marked checklist , no grading, the learner ticks their own work. */}
      <div style={{ display: "flex", flexDirection: "column", gap: REQ_GAP }}>
        {REQUIREMENTS.map((req, i) => {
          const reveal = reqReveals[i] ?? 0;
          const isChecked = checks[i] > 0.5;

          return (
            <div
              key={req}
              style={{
                height: REQ_HEIGHT,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 14px",
                borderRadius: 12,
                border: "1.5px solid",
                borderColor: isChecked ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.2)",
                background: isChecked ? "rgba(99,102,241,0.06)" : "#ffffff",
                transform: `translateY(${(1 - reveal) * 22}px)`,
                opacity: reveal,
              }}
            >
              <Checkbox progress={checks[i]} />
              <span
                style={{
                  fontSize: 15,
                  color: isChecked ? "#111827" : "#4b5563",
                  fontWeight: isChecked ? 600 : 500,
                }}
              >
                {req}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, height: 20 }}>
          Link to what you built <span style={{ color: "#9ca3af" }}>(optional)</span>
        </div>
        <div
          style={{
            height: LINK_FIELD_HEIGHT,
            borderRadius: 12,
            border: "1px solid rgba(99,102,241,0.22)",
            background: "#f9fafb",
            display: "flex",
            alignItems: "center",
            padding: "0 15px",
            fontSize: 15,
            color: linkTyped.length > 0 ? "#111827" : "#9ca3af",
          }}
        >
          {linkTyped.length > 0 ? (
            <>
              {linkTyped}
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 18,
                  background: "#6366f1",
                  marginLeft: 2,
                  opacity: caretVisible ? 1 : 0,
                }}
              />
            </>
          ) : (
            "https://github.com/… , a Figma file, a live site"
          )}
        </div>
      </div>

      <div style={{ marginTop: 14, height: SAVE_HEIGHT }}>
        {done > 0 ? (
          <div
            style={{
              height: SAVE_HEIGHT,
              borderRadius: 12,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.35)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 16px",
              opacity: done,
              transform: `translateY(${(1 - done) * 8}px)`,
            }}
          >
            <CheckCircleIcon size={18} color="#059669" />
            <span style={{ fontSize: 15, color: "#065f46" }}>
              <strong>Project complete.</strong> +75 XP added.
            </span>
          </div>
        ) : (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: SAVE_WIDTH,
              height: SAVE_HEIGHT,
              borderRadius: 999,
              background: "#6366f1",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              transform: `scale(${saveScale})`,
              boxShadow: "0 14px 30px -10px rgba(99,102,241,0.65)",
            }}
          >
            Mark complete
          </div>
        )}
      </div>
    </div>
  );
};
