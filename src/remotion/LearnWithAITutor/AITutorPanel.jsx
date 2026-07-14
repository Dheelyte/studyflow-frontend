import { ZapIcon } from "../icons";

export const TUTOR_WIDTH = 520;

export const FULL_EXPLANATION =
  "Data Analysis is the process of inspecting and modelling data to uncover patterns and guide decisions. Here, raw numbers become a story you can actually act on.";

export const AITutorPanel = ({
  enter = 1,
  charsShown = 0,
  caretVisible = true,
  loadingDots = 0,
  showLoading = true,
}) => {
  const typed = FULL_EXPLANATION.slice(0, charsShown);

  return (
    <div
      style={{
        width: TUTOR_WIDTH,
        background: "white",
        border: "1px solid rgba(99, 102, 241, 0.15)",
        borderRadius: 18,
        padding: 24,
        boxShadow:
          "0 30px 60px -20px rgba(99, 102, 241, 0.35), 0 10px 30px -10px rgba(0,0,0,0.08)",
        fontFamily: '"Google Sans", "Inter", sans-serif',
        transform: `translateY(${(1 - enter) * 24}px) scale(${0.96 + 0.04 * enter})`,
        opacity: enter,
        transformOrigin: "top right",
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
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ZapIcon size={22} color="#6366f1" fill="#6366f1" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111827" }}>
            AI Tutor
          </div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
            Paused at 0:42 - explaining this section
          </div>
        </div>
      </div>

      <div
        style={{
          minHeight: 140,
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
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: 18,
                background: "#6366f1",
                marginLeft: 2,
                verticalAlign: "middle",
                opacity: caretVisible ? 1 : 0,
                borderRadius: 1,
              }}
            />
          </span>
        )}
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
      <span style={{ marginLeft: 8, fontSize: 14, color: "#6b7280" }}>
        Thinking…
      </span>
    </div>
  );
};
