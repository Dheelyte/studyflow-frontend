import { PlayIcon, ZapIcon, ShareIcon } from "../icons";

export const DETAIL_WIDTH = 720;
export const DETAIL_IMAGE_SIZE = 160;
export const DETAIL_BUTTON_WIDTH = 236;
export const DETAIL_BUTTON_HEIGHT = 60;
export const DETAIL_IMAGE_CENTER_Y = 210;
export const DETAIL_TITLE_CENTER_Y = 360;
export const DETAIL_DESC_CENTER_Y = 460;
export const DETAIL_BUTTON_CENTER_Y = 560;
export const DETAIL_BUTTON_CENTER_X = 595;

export const CourseDetail = ({
  appear = 0,
  imageEnter = 0,
  titleEnter = 0,
  descEnter = 0,
  ctaEnter = 0,
  buttonScale = 1,
  buttonFlash = 0,
}) => {
  if (appear <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        opacity: appear,
        fontFamily: '"Google Sans", "Inter", sans-serif',
        color: "#111827",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: DETAIL_IMAGE_CENTER_Y,
          width: DETAIL_IMAGE_SIZE,
          height: DETAIL_IMAGE_SIZE,
          transform: `translate(-50%, -50%) translateY(${(1 - imageEnter) * -40}px) scale(${imageEnter})`,
          opacity: imageEnter,
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          borderRadius: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 24px 60px -12px rgba(99, 102, 241, 0.55)",
        }}
      >
        <ZapIcon size={72} color="white" fill="white" />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: DETAIL_TITLE_CENTER_Y,
          transform: `translate(-50%, -50%) translateY(${(1 - titleEnter) * 24}px)`,
          opacity: titleEnter,
          fontSize: 64,
          fontWeight: 900,
          lineHeight: 1.1,
          color: "#ffffff",
          whiteSpace: "nowrap",
        }}
      >
        Data Analysis
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: DETAIL_DESC_CENTER_Y,
          transform: `translate(-50%, -50%) translateY(${(1 - descEnter) * 18}px)`,
          opacity: descEnter,
          fontSize: 19,
          color: "#6b7280",
          lineHeight: 1.55,
          textAlign: "center",
          maxWidth: 700,
          fontWeight: 500,
        }}
      >
        Master the art of turning raw data into clear insights - statistics,
        visualisation, and storytelling with numbers.
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: DETAIL_BUTTON_CENTER_Y,
          transform: `translate(-50%, -50%) translateY(${(1 - ctaEnter) * 18}px)`,
          opacity: ctaEnter,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <button
          style={{
            width: DETAIL_BUTTON_WIDTH,
            height: DETAIL_BUTTON_HEIGHT,
            padding: "0 28px",
            background: "#6366f1",
            color: "white",
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            fontSize: 18,
            fontWeight: 700,
            border: "none",
            boxShadow: `0 ${12 + buttonFlash * 18}px ${28 + buttonFlash * 28}px -6px rgba(79, 70, 229, ${0.5 + buttonFlash * 0.3})`,
            fontFamily: "inherit",
            transform: `scale(${buttonScale})`,
            filter: `brightness(${1 + buttonFlash * 0.12})`,
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
            border: "1px solid rgba(99, 102, 241, 0.18)",
            color: "#6b7280",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ShareIcon size={22} color="#6b7280" />
        </button>
      </div>
    </div>
  );
};
