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
import { LightningBurst } from "./LightningBurst";
import {
  CourseDetail,
  DETAIL_BUTTON_CENTER_X,
  DETAIL_BUTTON_CENTER_Y,
} from "./CourseDetail";
import {
  CurriculumList,
  PANEL_WIDTH,
  TOPIC_HEIGHT,
  FIRST_TOPIC_Y_OFFSET,
} from "../LearnWithAITutor/CurriculumList";
import {
  VideoPlayer,
  VIDEO_WIDTH,
  VIDEO_HEIGHT,
} from "../LearnWithAITutor/VideoPlayer";
import { Camera, useCameraPath } from "../Camera";

const BAR_CENTER_Y = 340;

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const arcPath = (from, to, t, lift = 80) => {
  const x = from.x + (to.x - from.x) * t;
  const yLinear = from.y + (to.y - from.y) * t;
  const arc = -Math.sin(Math.PI * t) * lift;
  return { x, y: yLinear + arc };
};

// Search phase
const CURSOR_IN_END = 22;
const TYPE_START = 24;
const FRAMES_PER_CHAR = 2;
const CURSOR_TO_BUTTON_START = 54;
const CURSOR_TO_BUTTON_END = 70;
const BUTTON_PRESS_START = 70;
const BUTTON_PRESS_END = 82;
const PHASE_SWITCH = 100;

// Course detail phase
const DETAIL_CURSOR_START = 112;
const DETAIL_CURSOR_END = 140;
const DETAIL_BUTTON_PRESS_START = 140;
const DETAIL_BUTTON_PRESS_END = 155;

// Module phase
const MODULE_PHASE_START = 160;
const MODULE_HEADER_START = 172;
const MODULE_FULLY_SHOWN = 218;

// Opening the first lesson — the scene pays off on the video actually playing.
const LESSON_CURSOR_IN = 222;
const LESSON_CLICK = 248;
const LESSON_TRANSITION = 258;
const VIDEO_IN = 266;
const VIDEO_PLAY_START = 280;
const SCENE_END = 400;

// Exported so Root, Combined and the landing-page Player can't drift out of
// sync with the timeline when it gets retimed again.
export const SET_YOUR_GOAL_DURATION = SCENE_END;

export const SetYourGoal = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const barLeft = (width - BAR_WIDTH) / 2;
  const barTop = BAR_CENTER_Y - BAR_HEIGHT / 2;

  const inputTarget = { x: barLeft + 210, y: BAR_CENTER_Y };
  const buttonTarget = { x: barLeft + BAR_WIDTH - 80, y: BAR_CENTER_Y };

  const cursorStart = { x: width + 40, y: height - 20 };

  // The module panel is centred with a marginTop of 80, so the first topic card
  // sits at a position we can compute rather than guess. Declared up here
  // because the cursor path below reads it.
  const lessonClickX = (width - PANEL_WIDTH) / 2 + PANEL_WIDTH / 2;
  const lessonClickY = 80 + FIRST_TOPIC_Y_OFFSET + TOPIC_HEIGHT / 2;

  const barSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.6 },
    durationInFrames: 16,
  });
  const barScale = interpolate(barSpring, [0, 1], [0.92, 1]);
  const barPhaseOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barFadeOut = interpolate(frame, [PHASE_SWITCH - 10, PHASE_SWITCH + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const barOpacity = barPhaseOpacity * barFadeOut;
  const barLift = interpolate(barSpring, [0, 1], [30, 0]);

  const full = "Data Analysis";
  const charsTyped =
    frame < TYPE_START
      ? 0
      : Math.min(
          full.length,
          Math.floor((frame - TYPE_START) / FRAMES_PER_CHAR)
        );
  const typed = full.slice(0, charsTyped);
  const caretVisible = Math.floor((frame - TYPE_START) / 12) % 2 === 0;

  // Phase 1 cursor (search bar)
  let cursorX;
  let cursorY;

  if (frame < CURSOR_IN_END) {
    const t = easeInOut(frame / CURSOR_IN_END);
    const p = arcPath(cursorStart, inputTarget, t, 40);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < CURSOR_TO_BUTTON_START) {
    cursorX = inputTarget.x;
    cursorY = inputTarget.y;
  } else if (frame < CURSOR_TO_BUTTON_END) {
    const t = easeInOut(
      (frame - CURSOR_TO_BUTTON_START) /
        (CURSOR_TO_BUTTON_END - CURSOR_TO_BUTTON_START)
    );
    const p = arcPath(inputTarget, buttonTarget, t, 50);
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
  } else if (frame < MODULE_PHASE_START) {
    cursorX = DETAIL_BUTTON_CENTER_X;
    cursorY = DETAIL_BUTTON_CENTER_Y;
  } else if (frame < LESSON_CURSOR_IN - 20) {
    const t = Math.min(1, (frame - MODULE_PHASE_START) / 18);
    cursorX = interpolate(t, [0, 1], [DETAIL_BUTTON_CENTER_X, width + 80]);
    cursorY = interpolate(t, [0, 1], [DETAIL_BUTTON_CENTER_Y, height + 80]);
  } else if (frame < LESSON_CLICK) {
    const t = easeInOut(
      interpolate(frame, [LESSON_CURSOR_IN - 20, LESSON_CLICK], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    const p = arcPath(
      { x: width + 80, y: height + 40 },
      { x: lessonClickX, y: lessonClickY },
      t,
      60
    );
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < LESSON_TRANSITION) {
    cursorX = lessonClickX;
    cursorY = lessonClickY;
  } else {
    const t = easeInOut(
      interpolate(frame, [LESSON_TRANSITION, LESSON_TRANSITION + 20], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [lessonClickX, width + 80]);
    cursorY = interpolate(t, [0, 1], [lessonClickY, height + 80]);
  }

  let cursorScale = 1;
  if (frame >= CURSOR_IN_END && frame < CURSOR_IN_END + 7) {
    const t = (frame - CURSOR_IN_END) / 7;
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
  }
  if (frame >= BUTTON_PRESS_START && frame < BUTTON_PRESS_START + 10) {
    const t = (frame - BUTTON_PRESS_START) / 10;
    cursorScale = 1 - 0.18 * Math.sin(Math.PI * t);
  }
  if (
    frame >= DETAIL_BUTTON_PRESS_START &&
    frame < DETAIL_BUTTON_PRESS_START + 12
  ) {
    const t = (frame - DETAIL_BUTTON_PRESS_START) / 12;
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
  }
  if (frame >= LESSON_CLICK && frame < LESSON_CLICK + 10) {
    const t = (frame - LESSON_CLICK) / 10;
    cursorScale = 1 - 0.18 * Math.sin(Math.PI * t);
  }

  let rippleScale = 0;
  let rippleOpacity = 0;
  if (frame >= CURSOR_IN_END && frame < CURSOR_IN_END + 18) {
    const t = (frame - CURSOR_IN_END) / 18;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.4]);
    rippleOpacity = interpolate(t, [0, 1], [0.7, 0]);
  }
  if (frame >= DETAIL_BUTTON_PRESS_START && frame < DETAIL_BUTTON_PRESS_START + 22) {
    const t = (frame - DETAIL_BUTTON_PRESS_START) / 22;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.4]);
    rippleOpacity = interpolate(t, [0, 1], [0.7, 0]);
  }
  if (frame >= LESSON_CLICK && frame < LESSON_CLICK + 20) {
    const t = (frame - LESSON_CLICK) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.5]);
    rippleOpacity = interpolate(t, [0, 1], [0.8, 0]);
  }

  let buttonScale = 1;
  let buttonFlash = 0;
  if (frame >= BUTTON_PRESS_START && frame < BUTTON_PRESS_END) {
    const t = (frame - BUTTON_PRESS_START) / (BUTTON_PRESS_END - BUTTON_PRESS_START);
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

  const BURST_START = BUTTON_PRESS_START + 4;
  const BURST_END = PHASE_SWITCH + 4;
  let burstProgress = 0;
  if (frame >= BURST_START && frame < BURST_END) {
    burstProgress = (frame - BURST_START) / (BURST_END - BURST_START);
  }

  // Course detail enter animations
  const detailAppear = interpolate(
    frame,
    [PHASE_SWITCH - 4, PHASE_SWITCH + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const finalFade = 1;

  // Detail fades out as module appears
  const detailFadeOut = interpolate(
    frame,
    [MODULE_PHASE_START, MODULE_PHASE_START + 12],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Module 1 animations , reuse CurriculumList from LearnWithAITutor
  // Fade/slide in from the bottom (not the side)
  const moduleRise = interpolate(
    frame,
    [MODULE_PHASE_START + 4, MODULE_PHASE_START + 26],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const moduleRiseEased = easeInOut(moduleRise);
  const moduleTranslateY = (1 - moduleRiseEased) * 120;
  const moduleOpacity = moduleRise;
  const lessonHighlightPulse =
    frame >= LESSON_CLICK && frame < LESSON_TRANSITION
      ? Math.abs(Math.sin((frame - LESSON_CLICK) / 4)) *
        (1 - (frame - LESSON_CLICK) / (LESSON_TRANSITION - LESSON_CLICK))
      : 0;

  const moduleFadeOut = interpolate(
    frame,
    [LESSON_TRANSITION, LESSON_TRANSITION + 12],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const videoEnter = interpolate(frame, [VIDEO_IN, VIDEO_IN + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const videoPlayProgress = interpolate(
    frame,
    [VIDEO_PLAY_START, VIDEO_PLAY_START + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const videoPlaybackTime = Math.max(0, frame - VIDEO_PLAY_START);
  const videoLeft = (width - VIDEO_WIDTH) / 2;
  const videoTop = (height - VIDEO_HEIGHT) / 2;

  const moduleTopicReveals = [0, 1, 2, 3].map((i) =>
    interpolate(
      frame,
      [MODULE_HEADER_START + i * 7, MODULE_HEADER_START + 18 + i * 7],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  // One push-in onto the whole bar, then hold. At 640px wide the text field and
  // the Start button are both in frame at this zoom, so there is no pan to pay
  // for and no mid-phase pull-back — the only zoom-out is the 18-frame handoff
  // to the course detail.
  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: 640, y: BAR_CENTER_Y, scale: 1.12 },
      { frame: 14, x: 640, y: BAR_CENTER_Y, scale: 1.75 },
      { frame: BUTTON_PRESS_END, x: 640, y: BAR_CENTER_Y, scale: 1.78 },
      { frame: PHASE_SWITCH, x: 640, y: 360, scale: 1.0 },
      { frame: MODULE_FULLY_SHOWN, x: 640, y: 360, scale: 1.0 },
      // In on the lesson being clicked, then back out to frame the video.
      { frame: LESSON_CURSOR_IN + 6, x: lessonClickX, y: lessonClickY, scale: 1.38 },
      { frame: LESSON_CLICK + 6, x: lessonClickX, y: lessonClickY, scale: 1.42 },
      { frame: VIDEO_IN, x: 640, y: 360, scale: 1.0 },
      { frame: SCENE_END, x: 640, y: 360, scale: 1.08 },
    ],
    { x: 640, y: 360, scale: 1 }
  );

  const showSearchPhase = frame < PHASE_SWITCH + 20;

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

          {showSearchPhase && (
            <LightningBurst
              x={buttonTarget.x}
              y={buttonTarget.y}
              progress={burstProgress}
            />
          )}

          {detailAppear > 0 && detailFadeOut > 0 && (
            <CourseDetail
              appear={detailAppear * detailFadeOut}
              imageEnter={1}
              titleEnter={1}
              descEnter={1}
              ctaEnter={1}
              buttonScale={detailButtonScale}
              buttonFlash={detailButtonFlash}
            />
          )}

          {moduleRise > 0 && moduleFadeOut > 0 && (
            <AbsoluteFill
              style={{ alignItems: "center", justifyContent: "flex-start" }}
            >
              <div
                style={{
                  marginTop: 80,
                  transform: `translateY(${moduleTranslateY}px)`,
                  opacity: moduleOpacity * moduleFadeOut,
                }}
              >
                <CurriculumList
                  slideProgress={1}
                  topicReveals={moduleTopicReveals}
                  highlightIndex={frame >= LESSON_CLICK ? 0 : -1}
                  highlightPulse={lessonHighlightPulse}
                  panelOpacity={1}
                />
              </div>
            </AbsoluteFill>
          )}

          {videoEnter > 0 && (
            <AbsoluteFill>
              <div
                style={{
                  position: "absolute",
                  left: videoLeft,
                  top: videoTop - 42,
                  fontFamily: '"Google Sans", "Inter", sans-serif',
                  fontSize: 15,
                  color: "#6b7280",
                  fontWeight: 500,
                  opacity: videoEnter,
                }}
              >
                <span style={{ color: "#6366f1", fontWeight: 700 }}>Data Analysis</span>
                <span style={{ margin: "0 10px" }}>/</span>
                <span>What is Data Analysis?</span>
              </div>

              <div style={{ position: "absolute", left: videoLeft, top: videoTop }}>
                <VideoPlayer
                  enter={videoEnter}
                  playProgress={videoPlayProgress}
                  playbackTime={videoPlaybackTime}
                />
              </div>
            </AbsoluteFill>
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
