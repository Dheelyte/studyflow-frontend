export const PANEL_WIDTH = 1280;
export const PANEL_HEIGHT = 720;

// The scene keeps its own full-bleed Backdrop, which becomes this panel's
// wallpaper. That is what makes it read as a lit device rather than UI cards
// floating in a room, and it only lines up because the panel box matches the
// composition size exactly.
export const ScreenPanel = ({
  width = PANEL_WIDTH,
  height = PANEL_HEIGHT,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width,
      height,
      marginLeft: -width / 2,
      marginTop: -height / 2,
      borderRadius: 30,
      boxShadow: [
        "inset 0 0 0 1px rgba(165,180,252,0.20)",
        "0 60px 120px -40px rgba(0,0,0,0.85)",
        "0 0 140px -30px rgba(99,102,241,0.55)",
      ].join(", "),
      backfaceVisibility: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: 24,
        overflow: "hidden",
        // Solid ground: without it the rounded corners leave a 1px transparent
        // seam once the plane is resampled through the 3D transform.
        background: "#0b1020",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(105deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 42%)",
        }}
      />
    </div>
  </div>
);
