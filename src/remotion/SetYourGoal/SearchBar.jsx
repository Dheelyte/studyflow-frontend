import { SearchIcon, ZapIcon } from "../icons";

export const BAR_WIDTH = 900;
export const BAR_HEIGHT = 72;

export const INPUT_CLICK_X = 260;
export const INPUT_CLICK_Y = 36;
export const BUTTON_CLICK_X = BAR_WIDTH - 90;
export const BUTTON_CLICK_Y = 36;

export const SearchBar = ({
  typed = "",
  caretVisible = true,
  buttonScale = 1,
  buttonFlash = 0,
  barScale = 1,
  barOpacity = 1,
  barLift = 0,
}) => {
  const prefix = "I want to learn ";
  const hasTyped = typed.length > 0;

  return (
    <div
      style={{
        width: BAR_WIDTH,
        opacity: barOpacity,
        transform: `translateY(${barLift}px) scale(${barScale})`,
        transformOrigin: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#ffffff",
          border: "1px solid rgba(99, 102, 241, 0.12)",
          borderRadius: 99,
          padding: 8,
          boxShadow:
            "0 30px 60px -20px rgba(99, 102, 241, 0.35), 0 10px 30px -10px rgba(0,0,0,0.12)",
          fontFamily: '"Google Sans", "Inter", sans-serif',
          position: "relative",
        }}
      >
        <div
          style={{
            paddingLeft: 20,
            color: "#6b7280",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SearchIcon size={26} color="#6b7280" />
        </div>

        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            fontSize: 22,
            color: "#111827",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {!hasTyped && (
            <span style={{ color: "#9ca3af", opacity: 0.85 }}>
              What do you want to learn?
            </span>
          )}
          {hasTyped && (
            <>
              <span style={{ color: "#6b7280", marginRight: 6 }}>{prefix.trimEnd()}</span>
              <span style={{ color: "#111827", fontWeight: 600 }}>
                {typed.slice(prefix.length)}
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: 2,
                  height: 26,
                  background: "#6366f1",
                  marginLeft: 2,
                  opacity: caretVisible ? 1 : 0,
                  borderRadius: 1,
                }}
              />
            </>
          )}
        </div>

        <button
          type="button"
          style={{
            background: "#6366f1",
            color: "white",
            border: "none",
            height: 56,
            padding: "0 28px",
            borderRadius: 99,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            fontFamily: '"Google Sans", "Inter", sans-serif',
            fontWeight: 700,
            fontSize: 18,
            marginLeft: 8,
            flexShrink: 0,
            transform: `scale(${buttonScale})`,
            transformOrigin: "center",
            boxShadow: `0 ${10 + buttonFlash * 20}px ${
              20 + buttonFlash * 30
            }px -6px rgba(99, 102, 241, ${0.45 + buttonFlash * 0.3})`,
            filter: `brightness(${1 + buttonFlash * 0.15})`,
            cursor: "pointer",
          }}
        >
          <span>Start</span>
          <ZapIcon size={22} color="white" fill="white" />
        </button>
      </div>
    </div>
  );
};
