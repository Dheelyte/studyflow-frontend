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
import {
  AITutorPanel,
  FULL_EXPLANATION,
  FOLLOW_UP,
  TUTOR_REPLY,
  TUTOR_WIDTH,
  TUTOR_INPUT,
  TUTOR_SEND,
  TUTOR_EXPLANATION,
  TUTOR_REPLY_BLOCK,
} from "./AITutorPanel";
import {
  ScreenTutorWidget,
  ST_WIDTH,
  ST_SHOT,
  ST_CAPTURE_BTN,
  ST_REGION,
  ST_INPUT,
  ST_ASK_BTN,
  ST_ANSWER_BLOCK,
  ST_QUESTION,
  ST_ANSWER,
} from "./ScreenTutorWidget";
import { Camera, useCameraPath } from "../Camera";

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const ACT = {
  PANEL_SLIDE_IN: 0,
  TOPIC_CASCADE_START: 20,
  CURSOR_ENTER: 46,
  TOPIC_CLICK: 74,
  VIEW_TRANSITION: 92,
  VIDEO_IN: 104,
  VIDEO_PLAY_START: 118,
  BUTTON_IN: 132,
  CURSOR_TO_BUTTON: 142,
  BUTTON_CLICK: 158,
  BUTTON_SLIDE: 163,
  PANEL_IN: 168,
  STREAM_START: 180,
  STREAM_END: 248,

  // The learner writes back and the tutor answers again.
  FU_TYPE_START: 264,
  FU_TYPE_END: 302,
  FU_SEND: 312,
  REPLY_THINK_START: 316,
  REPLY_START: 336,
  REPLY_END: 394,

  // Screen tutor: capture the editor, ring the part you're stuck on, ask.
  ST_IN: 410,
  ST_CAPTURE_CLICK: 434,
  ST_REGION_START: 450,
  ST_REGION_END: 470,
  ST_TYPE_START: 478,
  ST_TYPE_END: 520,
  ST_ASK_CLICK: 528,
  ST_ANSWER_START: 540,
  ST_ANSWER_END: 600,
  HOLD_END: 640,
};

export const LEARN_WITH_AI_TUTOR_DURATION = ACT.HOLD_END;

const TUTOR_LEFT = 725;
// High enough that the whole 488px panel, composer included, stays on screen.
const TUTOR_TOP = 186;

const ST_LEFT = 700;
// Sits high so the answer block, which is the last element in the widget, is
// not against the bottom of the frame once the camera pushes into it.
const ST_TOP = 76;

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
      [ACT.TOPIC_CASCADE_START + i * 8, ACT.TOPIC_CASCADE_START + 18 + i * 8],
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
  // Clears the taller chat panel that slides in beneath it.
  const buttonFinalY = 120;
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

  // ---- Follow-up exchange ----
  const fuTypedChars =
    frame < ACT.FU_TYPE_START
      ? 0
      : Math.round(
          interpolate(frame, [ACT.FU_TYPE_START, ACT.FU_TYPE_END], [0, FOLLOW_UP.length], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        );
  // The composer empties the moment it is sent; the text reappears as a bubble.
  const fuInInput = frame < ACT.FU_SEND ? FOLLOW_UP.slice(0, fuTypedChars) : "";
  const fuBubbleOpacity = interpolate(
    frame,
    [ACT.FU_SEND, ACT.FU_SEND + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const replyThinking =
    frame >= ACT.REPLY_THINK_START && frame < ACT.REPLY_START;
  const replyChars = Math.floor(
    interpolate(frame, [ACT.REPLY_START, ACT.REPLY_END], [0, TUTOR_REPLY.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  let sendScale = 1;
  if (frame >= ACT.FU_SEND && frame < ACT.FU_SEND + 12) {
    sendScale = 1 - 0.16 * Math.sin(((frame - ACT.FU_SEND) / 12) * Math.PI);
  }

  const tutorInputPt = { x: TUTOR_LEFT + TUTOR_INPUT.x, y: TUTOR_TOP + TUTOR_INPUT.y };
  const tutorSendPt = { x: TUTOR_LEFT + TUTOR_SEND.x, y: TUTOR_TOP + TUTOR_SEND.y };
  const tutorCenterX = TUTOR_LEFT + TUTOR_WIDTH / 2;
  const tutorExplCenterY =
    TUTOR_TOP + TUTOR_EXPLANATION.y + TUTOR_EXPLANATION.h / 2;
  const tutorReplyCenterY =
    TUTOR_TOP + TUTOR_REPLY_BLOCK.y + TUTOR_REPLY_BLOCK.h / 2;

  // ---- Screen tutor ----
  const stEnter = easeInOut(
    interpolate(frame, [ACT.ST_IN, ACT.ST_IN + 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  // The lesson chat steps aside so the floating widget owns the right column.
  const aiPanelFade = interpolate(frame, [ACT.ST_IN, ACT.ST_IN + 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stCaptured = interpolate(
    frame,
    [ACT.ST_CAPTURE_CLICK + 4, ACT.ST_CAPTURE_CLICK + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stFlash = interpolate(
    frame,
    [ACT.ST_CAPTURE_CLICK, ACT.ST_CAPTURE_CLICK + 5, ACT.ST_CAPTURE_CLICK + 14],
    [0, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stRegionProgress = interpolate(
    frame,
    [ACT.ST_REGION_START, ACT.ST_REGION_END],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const stRegionLocked = frame >= ACT.ST_REGION_END;

  const stTypedChars =
    frame < ACT.ST_TYPE_START
      ? 0
      : Math.min(
          ST_QUESTION.length,
          Math.round(
            interpolate(frame, [ACT.ST_TYPE_START, ACT.ST_TYPE_END], [0, ST_QUESTION.length], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          )
        );
  const stAnswerChars = Math.floor(
    interpolate(frame, [ACT.ST_ANSWER_START, ACT.ST_ANSWER_END], [0, ST_ANSWER.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const stAsking = frame >= ACT.ST_ASK_CLICK && frame < ACT.ST_ANSWER_START;
  let stAskScale = 1;
  if (frame >= ACT.ST_ASK_CLICK && frame < ACT.ST_ASK_CLICK + 12) {
    stAskScale = 1 - 0.15 * Math.sin(((frame - ACT.ST_ASK_CLICK) / 12) * Math.PI);
  }

  const stCaptureBtn = {
    x: ST_LEFT + ST_CAPTURE_BTN.x,
    y: ST_TOP + ST_CAPTURE_BTN.y,
  };
  const stRegionFrom = {
    x: ST_LEFT + ST_SHOT.x + ST_REGION.x,
    y: ST_TOP + ST_SHOT.y + ST_REGION.y,
  };
  const stRegionTo = {
    x: stRegionFrom.x + ST_REGION.w,
    y: stRegionFrom.y + ST_REGION.h,
  };
  const stAskBtn = { x: ST_LEFT + ST_ASK_BTN.x, y: ST_TOP + ST_ASK_BTN.y };
  const stCenterX = ST_LEFT + ST_WIDTH / 2;
  const stShotCenterY = ST_TOP + ST_SHOT.y + ST_SHOT.h / 2;
  const stAnswerCenterY = ST_TOP + ST_ANSWER_BLOCK.y + ST_ANSWER_BLOCK.h / 2;
  // Answer block bottom plus the widget's 20px bottom padding.
  const stBottom = ST_TOP + ST_ANSWER_BLOCK.y + ST_ANSWER_BLOCK.h + 20;

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
  } else if (frame < ACT.FU_TYPE_START - 18) {
    const t = interpolate(
      frame,
      [ACT.PANEL_IN + 10, ACT.PANEL_IN + 32],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    cursorX = interpolate(t, [0, 1], [buttonCenterX, width + 40]);
    cursorY = interpolate(t, [0, 1], [buttonCenterY, height + 40]);
  } else if (frame < ACT.FU_TYPE_START) {
    const t = easeInOut(
      interpolate(frame, [ACT.FU_TYPE_START - 18, ACT.FU_TYPE_START], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [width + 40, tutorInputPt.x - 110]);
    cursorY = interpolate(t, [0, 1], [height + 40, tutorInputPt.y]);
  } else if (frame < ACT.FU_TYPE_END) {
    cursorX = tutorInputPt.x - 110;
    cursorY = tutorInputPt.y;
  } else if (frame < ACT.FU_SEND) {
    const t = easeInOut(
      interpolate(frame, [ACT.FU_TYPE_END, ACT.FU_SEND], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [tutorInputPt.x - 110, tutorSendPt.x]);
    cursorY = interpolate(t, [0, 1], [tutorInputPt.y, tutorSendPt.y]);
  } else if (frame < ACT.ST_IN + 6) {
    const t = easeInOut(
      interpolate(frame, [ACT.FU_SEND + 12, ACT.FU_SEND + 40], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [tutorSendPt.x, width + 60]);
    cursorY = interpolate(t, [0, 1], [tutorSendPt.y, height + 60]);
  } else if (frame < ACT.ST_CAPTURE_CLICK) {
    const t = easeInOut(
      interpolate(frame, [ACT.ST_IN + 6, ACT.ST_CAPTURE_CLICK], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [width + 40, stCaptureBtn.x]);
    cursorY = interpolate(t, [0, 1], [height + 40, stCaptureBtn.y]);
  } else if (frame < ACT.ST_REGION_START) {
    const t = easeInOut(
      interpolate(frame, [ACT.ST_CAPTURE_CLICK + 8, ACT.ST_REGION_START], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [stCaptureBtn.x, stRegionFrom.x]);
    cursorY = interpolate(t, [0, 1], [stCaptureBtn.y, stRegionFrom.y]);
  } else if (frame < ACT.ST_REGION_END) {
    // Raw progress, not eased — the cursor must sit exactly on the corner of
    // the region box as it is dragged out.
    cursorX = interpolate(stRegionProgress, [0, 1], [stRegionFrom.x, stRegionTo.x]);
    cursorY = interpolate(stRegionProgress, [0, 1], [stRegionFrom.y, stRegionTo.y]);
  } else if (frame < ACT.ST_ASK_CLICK) {
    const t = easeInOut(
      interpolate(frame, [ACT.ST_TYPE_END, ACT.ST_ASK_CLICK], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    );
    cursorX = interpolate(t, [0, 1], [stRegionTo.x, stAskBtn.x]);
    cursorY = interpolate(t, [0, 1], [stRegionTo.y, stAskBtn.y]);
  } else if (frame < ACT.ST_ANSWER_START + 20) {
    cursorX = stAskBtn.x;
    cursorY = stAskBtn.y;
  } else {
    const t = easeInOut(
      interpolate(
        frame,
        [ACT.ST_ANSWER_START + 20, ACT.ST_ANSWER_START + 46],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    );
    cursorX = interpolate(t, [0, 1], [stAskBtn.x, width + 60]);
    cursorY = interpolate(t, [0, 1], [stAskBtn.y, height + 60]);
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
  if (frame >= ACT.FU_SEND && frame < ACT.FU_SEND + 10) {
    const t = (frame - ACT.FU_SEND) / 10;
    cursorScale = 1 - 0.18 * Math.sin(t * Math.PI);
  }
  if (frame >= ACT.ST_CAPTURE_CLICK && frame < ACT.ST_CAPTURE_CLICK + 10) {
    const t = (frame - ACT.ST_CAPTURE_CLICK) / 10;
    cursorScale = 1 - 0.18 * Math.sin(t * Math.PI);
  }
  if (frame >= ACT.ST_REGION_START && frame < ACT.ST_REGION_END) {
    cursorScale = 0.85;
  }
  if (frame >= ACT.ST_ASK_CLICK && frame < ACT.ST_ASK_CLICK + 10) {
    const t = (frame - ACT.ST_ASK_CLICK) / 10;
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
  if (frame >= ACT.FU_SEND && frame < ACT.FU_SEND + 20) {
    const t = (frame - ACT.FU_SEND) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.5]);
    rippleOpacity = interpolate(t, [0, 1], [0.8, 0]);
  }
  if (frame >= ACT.ST_CAPTURE_CLICK && frame < ACT.ST_CAPTURE_CLICK + 20) {
    const t = (frame - ACT.ST_CAPTURE_CLICK) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.5]);
    rippleOpacity = interpolate(t, [0, 1], [0.8, 0]);
  }
  if (frame >= ACT.ST_ASK_CLICK && frame < ACT.ST_ASK_CLICK + 20) {
    const t = (frame - ACT.ST_ASK_CLICK) / 20;
    rippleScale = interpolate(t, [0, 1], [0.3, 1.5]);
    rippleOpacity = interpolate(t, [0, 1], [0.8, 0]);
  }

  const finalFade = interpolate(frame, [ACT.HOLD_END - 10, ACT.HOLD_END], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showVideoView = frame >= ACT.VIEW_TRANSITION;

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: 640, y: 360, scale: 1.0 },
      { frame: 18, x: 640, y: topicClickY - 40, scale: 1.06 },
      { frame: 52, x: topicClickX, y: topicClickY, scale: 1.32 },
      { frame: ACT.TOPIC_CLICK, x: topicClickX, y: topicClickY, scale: 1.36 },
      { frame: ACT.TOPIC_CLICK + 12, x: topicClickX, y: topicClickY, scale: 1.3 },
      { frame: ACT.VIEW_TRANSITION + 4, x: 640, y: 360, scale: 1.5 },
      { frame: ACT.VIDEO_IN + 10, x: videoCenterX, y: videoCenterY, scale: 1.5 },
      { frame: ACT.BUTTON_IN, x: videoCenterX, y: videoCenterY, scale: 1.5 },
      { frame: ACT.CURSOR_TO_BUTTON, x: buttonCenterX, y: buttonCenterY, scale: 1.38 },
      { frame: ACT.BUTTON_CLICK, x: buttonCenterX, y: buttonCenterY, scale: 1.42 },
      { frame: ACT.PANEL_IN, x: tutorCenterX, y: tutorExplCenterY, scale: 1.15 },
      { frame: ACT.STREAM_START + 8, x: tutorCenterX, y: tutorExplCenterY, scale: 1.24 },
      { frame: ACT.STREAM_END - 12, x: tutorCenterX, y: tutorExplCenterY, scale: 1.24 },
      // Down to the composer to write back, then onto the reply as it streams.
      { frame: ACT.FU_TYPE_START, x: tutorCenterX, y: tutorInputPt.y - 26, scale: 1.44 },
      { frame: ACT.FU_SEND, x: tutorCenterX, y: tutorInputPt.y - 26, scale: 1.44 },
      { frame: ACT.REPLY_START, x: tutorCenterX, y: tutorReplyCenterY, scale: 1.5 },
      { frame: ACT.REPLY_END, x: tutorCenterX, y: tutorReplyCenterY, scale: 1.64 },
      { frame: ACT.ST_IN + 12, x: stCenterX, y: ST_TOP + 300, scale: 1.12 },
      { frame: ACT.ST_CAPTURE_CLICK, x: stCenterX, y: stShotCenterY, scale: 1.35 },
      { frame: ACT.ST_REGION_START, x: stCenterX, y: stShotCenterY, scale: 1.6 },
      { frame: ACT.ST_REGION_END + 8, x: stCenterX, y: stShotCenterY, scale: 1.6 },
      { frame: ACT.ST_TYPE_START + 10, x: stCenterX, y: ST_TOP + ST_INPUT.y, scale: 1.4 },
      { frame: ACT.ST_ASK_CLICK, x: stCenterX, y: ST_TOP + ST_ASK_BTN.y - 20, scale: 1.4 },
      // Settle onto the answer as the first characters land, then keep creeping
      // in the whole time it streams. No pull-back — the scene ends on it.
      // The answer is the last element in the widget, so focusing on its centre
      // hangs half the frame off the bottom of the card. Anchor the widget's
      // bottom edge to the bottom of frame instead and let the zoom do the work.
      { frame: ACT.ST_ANSWER_START + 6, x: stCenterX, y: stBottom - 360 / 1.38, scale: 1.38 },
      { frame: ACT.HOLD_END, x: stCenterX, y: stBottom - 360 / 1.5, scale: 1.5 },
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

            {frame >= ACT.PANEL_IN - 2 && aiPanelFade > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: TUTOR_LEFT,
                  top: TUTOR_TOP,
                  opacity: aiPanelFade,
                }}
              >
                <AITutorPanel
                  enter={aiPanelEnter}
                  charsShown={charsShown}
                  caretVisible={caretVisible}
                  loadingDots={((frame - ACT.PANEL_IN) / 15) % 3}
                  showLoading={frame < ACT.STREAM_START}
                  followUpTyped={fuInInput}
                  bubbleOpacity={fuBubbleOpacity}
                  replyChars={replyChars}
                  replyThinking={replyThinking}
                  replyDots={((frame - ACT.REPLY_THINK_START) / 15) % 3}
                  sendScale={sendScale}
                  sendActive={fuTypedChars > 0}
                />
              </div>
            )}

            {frame >= ACT.ST_IN - 2 && (
              <div style={{ position: "absolute", left: ST_LEFT, top: ST_TOP }}>
                <ScreenTutorWidget
                  enter={stEnter}
                  captured={stCaptured}
                  flash={stFlash}
                  regionProgress={stRegionProgress}
                  regionLocked={stRegionLocked}
                  typedQuestion={ST_QUESTION.slice(0, stTypedChars)}
                  caretVisible={caretVisible}
                  askScale={stAskScale}
                  asking={stAsking}
                  answerChars={stAnswerChars}
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
