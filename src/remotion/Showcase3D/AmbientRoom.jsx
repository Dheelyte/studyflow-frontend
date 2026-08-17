import { AbsoluteFill } from "remotion";

// Deliberately not a reuse of the scenes' Backdrop: if the room and the screen
// share a gradient the panel stops reading as a separate lit object. Same
// palette tokens, different value structure.
export const AmbientRoom = () => (
  <AbsoluteFill style={{ background: "#05070f" }}>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(120% 90% at 50% 38%, rgba(30,27,75,0.95) 0%, rgba(12,14,32,0.60) 45%, rgba(5,7,15,0) 75%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(70% 45% at 50% 94%, rgba(99,102,241,0.30) 0%, rgba(99,102,241,0) 70%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(75% 75% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)",
      }}
    />
  </AbsoluteFill>
);
