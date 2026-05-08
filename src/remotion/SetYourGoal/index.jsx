import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { Backdrop } from "./Backdrop";
import { SearchBar, BAR_WIDTH, BAR_HEIGHT } from "./SearchBar";
import { Cursor } from "./Cursor";
import { ArrowLabel } from "./ArrowLabel";
import { LightningBurst } from "./LightningBurst";
import {
  CourseDetail,
  DETAIL_BUTTON_CENTER_X,
  DETAIL_BUTTON_CENTER_Y,
  DETAIL_IMAGE_CENTER_Y,
  DETAIL_TITLE_CENTER_Y,
} from "./CourseDetail";
import { Camera, useCameraPath } from "../Camera";

const BAR_CENTER_Y = 340;

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const arcPath = (from, to, t, lift = 80) => {
  const x = from.x + (to.x - from.x) * t;
  const yLinear = from.y + (to.y - from.y) * t;
  const arc = -Math.sin(Math.PI * t) * lift;
  return { x, y: yLinear + arc };
};

const PHASE_SWITCH = 190;
const DETAIL_CURSOR_START = 220;
const DETAIL_CURSOR_END = 272;
const DETAIL_BUTTON_PRESS_START = 272;
const DETAIL_BUTTON_PRESS_END = 290;

export const SetYourGoal = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const barLeft = (width - BAR_WIDTH) / 2;
  const barTop = BAR_CENTER_Y - BAR_HEIGHT / 2;

  const inputTarget = { x: barLeft + 210, y: BAR_CENTER_Y };
  const buttonTarget = { x: barLeft + BAR_WIDTH - 80, y: BAR_CENTER_Y };

  const cursorStart = { x: width + 40, y: height - 20 };

  const barSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, mass: 0.6 },
    durationInFrames: 25,
  });
  const barScale = interpolate(barSpring, [0, 1], [0.92, 1]);
  const barPhaseOpacity = interpolate(frame, [10, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barFadeOut = interpolate(frame, [PHASE_SWITCH - 10, PHASE_SWITCH + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barOpacity = barPhaseOpacity * barFadeOut;
  const barLift = interpolate(barSpring, [0, 1], [30, 0]);

  const prefix = "I want to learn ";
  const topic = "Data Analysis";
  const full = prefix + topic;
  const typeStart = 60;
  const prefixEnd = typeStart + 10;
  const charsTyped =
    frame < typeStart
      ? 0
      : frame < prefixEnd
      ? prefix.length
      : Math.min(
          full.length,
          prefix.length + Math.floor((frame - prefixEnd) / 3)
        );
  const typed = full.slice(0, charsTyped);
  const caretVisible = Math.floor((frame - typeStart) / 12) % 2 === 0;

  // Phase 1 cursor (search bar)
  let cursorX;
  let cursorY;

  if (frame < 25) {
    cursorX = cursorStart.x;
    cursorY = cursorStart.y;
  } else if (frame < 55) {
    const t = easeInOut((frame - 25) / 30);
    const p = arcPath(cursorStart, inputTarget, t, 40);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < 125) {
    cursorX = inputTarget.x;
    cursorY = inputTarget.y;
  } else if (frame < 150) {
    const t = easeInOut((frame - 125) / 25);
    const p = arcPath(inputTarget, buttonTarget, t, 60);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < PHASE_SWITCH) {
    cursorX = buttonTarget.x;
    cursorY = buttonTarget.y;
  } else if (frame < DETAIL_CURSOR_START) {
    // Off-screen during transition
    cursorX = width + 200;
    cursorY = height + 200;
  } else if (frame < DETAIL_CURSOR_END) {
    const t = easeInOut(
      (frame - DETAIL_CURSOR_START) / (DETAIL_CURSOR_END - DETAIL_CURSOR_START)
    );
    cursorX = interpolate(t, [0, 1], [width + 40, DETAIL_BUTTON_CENTER_X]);
    cursorY = interpolate(t, [0, 1], [height + 40, DETAIL_BUTTON_CENTER_Y]);
  } else if (frame < 300) {
    cursorX = DETAIL_BUTTON_CENTER_X;
    cursorY = DETAIL_BUTTON_CENTER_Y;
  } else {
    const t = Math.min(1, (frame - 300) / 25);
    cursorX = interpolate(t, [0, 1], [DETAIL_BUTTON_CENTER_X, width + 80]);
    cursorY = interpolate(t, [0, 1], [DETAIL_BUTTON_CENTER_Y, height + 80]);
  }

  let cursorScale = 1;
  if (frame >= 55 && frame < 62) {
    const t = (frame - 55) / 7;
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
  }
  if (frame >= 150 && frame < 160) {
    const t = (frame - 150) / 10;
    cursorScale = 1 - 0.18 * Math.sin(Math.PI * t);
  }
  if (
    frame >= DETAIL_BUTTON_PRESS_START &&
    frame < DETAIL_BUTTON_PRESS_START + 12
  ) {
    const t = (frame - DETAIL_BUTTON_PRESS_START) / 12;
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
  }

  let rippleScale = 0;
  let rippleOpacity = 0;
  if (frame >= 55 && frame < 75) {
    const t = (frame - 55) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.4]);
    rippleOpacity = interpolate(t, [0, 1], [0.7, 0]);
  }
  if (frame >= DETAIL_BUTTON_PRESS_START && frame < DETAIL_BUTTON_PRESS_START + 22) {
    const t = (frame - DETAIL_BUTTON_PRESS_START) / 22;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.4]);
    rippleOpacity = interpolate(t, [0, 1], [0.7, 0]);
  }

  let buttonScale = 1;
  let buttonFlash = 0;
  if (frame >= 150 && frame < 165) {
    const t = (frame - 150) / 15;
    if (t < 0.35) {
      buttonScale = interpolate(t, [0, 0.35], [1, 0.94]);
    } else if (t < 0.7) {
      buttonScale = interpolate(t, [0.35, 0.7], [0.94, 1.06]);
    } else {
      buttonScale = interpolate(t, [0.7, 1], [1.06, 1]);
    }
    buttonFlash = Math.sin(t * Math.PI);
  }

  let detailButtonScale = 1;
  let detailButtonFlash = 0;
  if (
    frame >= DETAIL_BUTTON_PRESS_START &&
    frame < DETAIL_BUTTON_PRESS_END
  ) {
    const t = (frame - DETAIL_BUTTON_PRESS_START) / (DETAIL_BUTTON_PRESS_END - DETAIL_BUTTON_PRESS_START);
    if (t < 0.35) {
      detailButtonScale = interpolate(t, [0, 0.35], [1, 0.94]);
    } else if (t < 0.7) {
      detailButtonScale = interpolate(t, [0.35, 0.7], [0.94, 1.06]);
    } else {
      detailButtonScale = interpolate(t, [0.7, 1], [1.06, 1]);
    }
    detailButtonFlash = Math.sin(t * Math.PI);
  }

  const arrowOpacity = interpolate(frame, [128, 145, 165, 172], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowDraw = interpolate(frame, [130, 148], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowBob = Math.sin((frame - 130) / 6) * 3;

  let burstProgress = 0;
  if (frame >= 155 && frame < 190) {
    burstProgress = (frame - 155) / 35;
  }

  // Course detail enter animations
  const detailAppear = interpolate(frame, [PHASE_SWITCH - 5, PHASE_SWITCH + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const detailImageEnter = spring({
    frame: frame - PHASE_SWITCH,
    fps,
    config: { damping: 13, mass: 0.7 },
    durationInFrames: 28,
  });
  const detailTitleEnter = interpolate(
    frame,
    [PHASE_SWITCH + 10, PHASE_SWITCH + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const detailDescEnter = interpolate(
    frame,
    [PHASE_SWITCH + 22, PHASE_SWITCH + 48],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const detailCtaEnter = interpolate(
    frame,
    [PHASE_SWITCH + 35, PHASE_SWITCH + 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const finalFade = interpolate(frame, [320, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Follow caret x during typing
  const caretStartX = barLeft + 300;
  const caretEndX = barLeft + 490;
  const typingProgress = interpolate(frame, [70, 109], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caretFollowX = interpolate(typingProgress, [0, 1], [caretStartX, caretEndX]);

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: 640, y: BAR_CENTER_Y, scale: 1.0 },
      { frame: 25, x: 640, y: BAR_CENTER_Y, scale: 1.1 },
      { frame: 55, x: inputTarget.x + 30, y: BAR_CENTER_Y, scale: 1.75 },
      { frame: 70, x: caretStartX, y: BAR_CENTER_Y, scale: 1.85 },
      { frame: 109, x: caretEndX, y: BAR_CENTER_Y, scale: 1.85 },
      { frame: 125, x: caretEndX + 30, y: BAR_CENTER_Y, scale: 1.7 },
      { frame: 148, x: buttonTarget.x, y: BAR_CENTER_Y, scale: 1.55 },
      { frame: 165, x: buttonTarget.x, y: BAR_CENTER_Y, scale: 1.45 },
      { frame: 180, x: 640, y: BAR_CENTER_Y, scale: 1.1 },
      { frame: PHASE_SWITCH, x: 640, y: 360, scale: 1.0 },
      { frame: 330, x: 640, y: 360, scale: 1.0 },
    ],
    { x: 640, y: 360, scale: 1 }
  );

  const showSearchPhase = frame < PHASE_SWITCH + 30;

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <Backdrop />

      <Camera focusX={cam.x} focusY={cam.y} scale={cam.scale}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showSearchPhase && barOpacity > 0 && (
            <div style={{ position: "absolute", left: barLeft, top: barTop }}>
              <SearchBar
                typed={typed}
                caretVisible={caretVisible && charsTyped > 0}
                buttonScale={buttonScale}
                buttonFlash={buttonFlash}
                barScale={barScale}
                barOpacity={barOpacity}
                barLift={barLift}
              />
            </div>
          )}

          {showSearchPhase && arrowOpacity > 0 && (
            <ArrowLabel
              x={buttonTarget.x - 170}
              y={buttonTarget.y - 170}
              opacity={arrowOpacity}
              drawProgress={arrowDraw}
              bob={arrowBob}
            />
          )}

          {showSearchPhase && (
            <LightningBurst
              x={buttonTarget.x}
              y={buttonTarget.y}
              progress={burstProgress}
            />
          )}

          {detailAppear > 0 && (
            <CourseDetail
              appear={detailAppear}
              imageEnter={1}
              titleEnter={1}
              descEnter={1}
              ctaEnter={1}
              buttonScale={detailButtonScale}
              buttonFlash={detailButtonFlash}
            />
          )}

          <Cursor
            x={cursorX}
            y={cursorY}
            scale={cursorScale}
            rippleScale={rippleScale}
            rippleOpacity={rippleOpacity}
          />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
