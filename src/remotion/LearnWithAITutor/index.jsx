import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { Backdrop } from "../SetYourGoal/Backdrop";
import { Cursor } from "../SetYourGoal/Cursor";
import {
  CurriculumList,
  PANEL_WIDTH,
  TOPIC_HEIGHT,
  TOPIC_GAP,
  FIRST_TOPIC_Y_OFFSET,
} from "./CurriculumList";
import { VideoPlayer, VIDEO_WIDTH, VIDEO_HEIGHT } from "./VideoPlayer";
import { ExplainButton, EXPLAIN_BTN_WIDTH, EXPLAIN_BTN_HEIGHT } from "./ExplainButton";
import { AITutorPanel, FULL_EXPLANATION } from "./AITutorPanel";
import { Camera, useCameraPath } from "../Camera";

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const ACT = {
  PANEL_SLIDE_IN: 0,
  TOPIC_CASCADE_START: 30,
  CURSOR_ENTER: 70,
  TOPIC_CLICK: 105,
  VIEW_TRANSITION: 130,
  VIDEO_IN: 145,
  VIDEO_PLAY_START: 165,
  BUTTON_IN: 185,
  CURSOR_TO_BUTTON: 200,
  BUTTON_CLICK: 220,
  BUTTON_SLIDE: 225,
  PANEL_IN: 230,
  STREAM_START: 245,
  STREAM_END: 360,
  HOLD_END: 390,
};

export const LearnWithAITutor = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const panelSlide = interpolate(
    frame,
    [ACT.PANEL_SLIDE_IN, ACT.PANEL_SLIDE_IN + 30],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const panelSlideEased = easeInOut(panelSlide);

  const topicReveals = [0, 1, 2, 3].map((i) =>
    interpolate(
      frame,
      [ACT.TOPIC_CASCADE_START + i * 10, ACT.TOPIC_CASCADE_START + 22 + i * 10],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    )
  );

  const panelFadeOut = interpolate(
    frame,
    [ACT.VIEW_TRANSITION, ACT.VIEW_TRANSITION + 20],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const panelTop = 80;
  const panelLeft = (width - PANEL_WIDTH) / 2;

  const topicCardBaseY = panelTop + FIRST_TOPIC_Y_OFFSET;
  const highlightIndex = 0;
  const targetTopicY =
    topicCardBaseY + highlightIndex * (TOPIC_HEIGHT + TOPIC_GAP) + TOPIC_HEIGHT / 2;
  const topicClickX = panelLeft + PANEL_WIDTH / 2;
  const topicClickY = targetTopicY;

  const cursorEntryStart = { x: width + 40, y: height + 40 };

  const highlightPulse =
    frame >= ACT.TOPIC_CLICK && frame < ACT.VIEW_TRANSITION
      ? Math.abs(Math.sin((frame - ACT.TOPIC_CLICK) / 4)) *
        (1 - (frame - ACT.TOPIC_CLICK) / (ACT.VIEW_TRANSITION - ACT.TOPIC_CLICK))
      : 0;

  const videoEnter = interpolate(
    frame,
    [ACT.VIDEO_IN, ACT.VIDEO_IN + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const playProgress = interpolate(
    frame,
    [ACT.VIDEO_PLAY_START, ACT.VIDEO_PLAY_START + 15],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const playbackTime = Math.max(0, frame - ACT.VIDEO_PLAY_START);

  const videoLeft = 60;
  const videoTop = 180;
  const videoCenterX = videoLeft + VIDEO_WIDTH / 2;
  const videoCenterY = videoTop + VIDEO_HEIGHT / 2;

  const buttonEnter = spring({
    frame: frame - ACT.BUTTON_IN,
    fps,
    config: { damping: 13, mass: 0.7 },
    durationInFrames: 20,
  });

  let buttonScale = 1;
  if (frame >= ACT.BUTTON_CLICK && frame < ACT.BUTTON_CLICK + 12) {
    const t = (frame - ACT.BUTTON_CLICK) / 12;
    buttonScale = 1 - 0.15 * Math.sin(t * Math.PI);
  }

  const buttonInitialY = 310;
  const buttonFinalY = 195;
  const buttonSlideProgress = interpolate(
    frame,
    [ACT.BUTTON_SLIDE, ACT.BUTTON_SLIDE + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const buttonY = interpolate(
    easeInOut(buttonSlideProgress),
    [0, 1],
    [buttonInitialY, buttonFinalY]
  );
  const buttonX = 735;
  const buttonCenterX = buttonX + EXPLAIN_BTN_WIDTH / 2;
  const buttonCenterY = buttonInitialY + EXPLAIN_BTN_HEIGHT / 2;

  const sparkleTime = Math.max(0, frame - ACT.BUTTON_IN);

  const panelInProgress = interpolate(
    frame,
    [ACT.PANEL_IN, ACT.PANEL_IN + 18],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const aiPanelEnter = easeInOut(panelInProgress);

  const streamT = interpolate(
    frame,
    [ACT.STREAM_START, ACT.STREAM_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const charsShown = Math.floor(streamT * FULL_EXPLANATION.length);
  const caretVisible = Math.floor((frame - ACT.STREAM_START) / 10) % 2 === 0;

  // Cursor path
  let cursorX;
  let cursorY;

  if (frame < ACT.CURSOR_ENTER) {
    cursorX = cursorEntryStart.x;
    cursorY = cursorEntryStart.y;
  } else if (frame < ACT.TOPIC_CLICK) {
    const t = easeInOut((frame - ACT.CURSOR_ENTER) / (ACT.TOPIC_CLICK - ACT.CURSOR_ENTER));
    cursorX = interpolate(t, [0, 1], [cursorEntryStart.x, topicClickX]);
    cursorY = interpolate(t, [0, 1], [cursorEntryStart.y, topicClickY]);
  } else if (frame < ACT.VIEW_TRANSITION) {
    cursorX = topicClickX;
    cursorY = topicClickY;
  } else if (frame < ACT.CURSOR_TO_BUTTON) {
    cursorX = -100;
    cursorY = -100;
  } else if (frame < ACT.BUTTON_CLICK) {
    const t = easeInOut((frame - ACT.CURSOR_TO_BUTTON) / (ACT.BUTTON_CLICK - ACT.CURSOR_TO_BUTTON));
    cursorX = interpolate(t, [0, 1], [width + 40, buttonCenterX]);
    cursorY = interpolate(t, [0, 1], [height - 40, buttonCenterY]);
  } else if (frame < ACT.PANEL_IN + 10) {
    cursorX = buttonCenterX;
    cursorY = buttonCenterY;
  } else {
    const t = interpolate(
      frame,
      [ACT.PANEL_IN + 10, ACT.PANEL_IN + 35],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    cursorX = interpolate(t, [0, 1], [buttonCenterX, width + 40]);
    cursorY = interpolate(t, [0, 1], [buttonCenterY, height + 40]);
  }

  let cursorScale = 1;
  if (frame >= ACT.TOPIC_CLICK && frame < ACT.TOPIC_CLICK + 10) {
    const t = (frame - ACT.TOPIC_CLICK) / 10;
    cursorScale = 1 - 0.18 * Math.sin(t * Math.PI);
  }
  if (frame >= ACT.BUTTON_CLICK && frame < ACT.BUTTON_CLICK + 10) {
    const t = (frame - ACT.BUTTON_CLICK) / 10;
    cursorScale = 1 - 0.18 * Math.sin(t * Math.PI);
  }

  let rippleScale = 0;
  let rippleOpacity = 0;
  if (frame >= ACT.TOPIC_CLICK && frame < ACT.TOPIC_CLICK + 20) {
    const t = (frame - ACT.TOPIC_CLICK) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.4]);
    rippleOpacity = interpolate(t, [0, 1], [0.7, 0]);
  }
  if (frame >= ACT.BUTTON_CLICK && frame < ACT.BUTTON_CLICK + 20) {
    const t = (frame - ACT.BUTTON_CLICK) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.5]);
    rippleOpacity = interpolate(t, [0, 1], [0.8, 0]);
  }

  const finalFade = interpolate(frame, [ACT.HOLD_END - 10, ACT.HOLD_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showVideoView = frame >= ACT.VIEW_TRANSITION;

  const aiPanelCenterX = 725 + 260;
  const aiPanelCenterY = 280 + 120;

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: 640, y: 360, scale: 1.0 },
      { frame: ACT.TOPIC_CASCADE_START, x: 640, y: topicClickY - 40, scale: 1.05 },
      { frame: ACT.CURSOR_ENTER, x: topicClickX, y: topicClickY, scale: 1.25 },
      { frame: ACT.TOPIC_CLICK, x: topicClickX, y: topicClickY, scale: 1.35 },
      { frame: ACT.TOPIC_CLICK + 15, x: topicClickX, y: topicClickY, scale: 1.3 },
      { frame: ACT.VIEW_TRANSITION + 10, x: 640, y: 360, scale: 1.5 },
      { frame: ACT.VIDEO_IN + 20, x: videoCenterX, y: videoCenterY, scale: 1.5 },
      { frame: ACT.BUTTON_IN, x: videoCenterX, y: videoCenterY, scale: 1.5 },
      { frame: ACT.CURSOR_TO_BUTTON + 5, x: buttonCenterX, y: buttonCenterY, scale: 1.35 },
      { frame: ACT.BUTTON_CLICK, x: buttonCenterX, y: buttonCenterY, scale: 1.4 },
      { frame: ACT.PANEL_IN + 5, x: aiPanelCenterX, y: aiPanelCenterY, scale: 1.15 },
      { frame: ACT.STREAM_START + 20, x: aiPanelCenterX, y: aiPanelCenterY + 20, scale: 1.2 },
      { frame: ACT.STREAM_END - 20, x: aiPanelCenterX, y: aiPanelCenterY + 20, scale: 1.2 },
      { frame: ACT.HOLD_END, x: 640, y: 360, scale: 1.0 },
    ],
    { x: 640, y: 360, scale: 1 }
  );

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <Backdrop filterId="tutorBlur" />

      <Camera focusX={cam.x} focusY={cam.y} scale={cam.scale}>
        {/* Curriculum panel */}
        {frame >= ACT.PANEL_SLIDE_IN - 1 && (
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start" }}>
            <div style={{ marginTop: panelTop }}>
              <CurriculumList
                slideProgress={panelSlideEased}
                topicReveals={topicReveals}
                highlightIndex={frame >= ACT.TOPIC_CLICK ? highlightIndex : -1}
                highlightPulse={highlightPulse}
                panelOpacity={panelFadeOut}
              />
            </div>
          </AbsoluteFill>
        )}

        {showVideoView && (
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
                playProgress={playProgress}
                playbackTime={playbackTime}
              />
            </div>

            <div style={{ position: "absolute", left: buttonX, top: buttonY }}>
              <ExplainButton
                enter={buttonEnter}
                buttonScale={buttonScale}
                sparkleTime={sparkleTime}
              />
            </div>

            {frame >= ACT.PANEL_IN - 2 && (
              <div style={{ position: "absolute", left: 725, top: 280 }}>
                <AITutorPanel
                  enter={aiPanelEnter}
                  charsShown={charsShown}
                  caretVisible={caretVisible}
                  loadingDots={((frame - ACT.PANEL_IN) / 15) % 3}
                  showLoading={frame < ACT.STREAM_START}
                />
              </div>
            )}
          </AbsoluteFill>
        )}

        <Cursor
          x={cursorX}
          y={cursorY}
          scale={cursorScale}
          rippleScale={rippleScale}
          rippleOpacity={rippleOpacity}
        />
      </Camera>
    </AbsoluteFill>
  );
};
