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
import { CourseContext } from "./CourseContext";
import { QuizModal, MODAL_WIDTH, MODAL_HEIGHT } from "./QuizModal";
import {
  QuestionView,
  QUESTION_TEXT,
  CORRECT_ID,
  OPTIONS,
} from "./QuestionView";
import { ResultsView } from "./ResultsView";
import { Confetti } from "./Confetti";
import { Camera, useCameraPath } from "../Camera";

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

const arcPath = (from, to, t, lift = 80) => {
  const x = from.x + (to.x - from.x) * t;
  const yLinear = from.y + (to.y - from.y) * t;
  const arc = -Math.sin(Math.PI * t) * lift;
  return { x, y: yLinear + arc };
};

const QUIZ_CARD_TARGET = { x: 640, y: 495 };
const OPTION_B_TARGET = { x: 640, y: 395 };
const FINISH_BUTTON_TARGET = { x: 851, y: 605 };

const T = {
  contextIn: [0, 24],
  cursorFlyIn: [24, 54],
  quizCardHover: [46, 66],
  quizCardPress: [60, 72],
  modalTransition: [70, 102],
  questionType: [100, 145],
  optionsCascade: [135, 205],
  cursorToOptionB: [205, 245],
  optionBClick: [240, 252],
  correctionReveal: [250, 275],
  cursorToFinish: [275, 302],
  finishClick: [302, 315],
  resultsEnter: [315, 345],
  confettiStart: 325,
  scorePop: [330, 360],
  resultsMessage: [345, 375],
  resultsSubtext: [360, 385],
  resultsButton: [375, 400],
  hold: [400, 440],
  fadeOut: [440, 450],
};

const clamped = (frame, [start, end]) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const QuizScene = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const contextSpring = spring({
    frame: frame - T.contextIn[0],
    fps,
    config: { damping: 14, mass: 0.7 },
    durationInFrames: 28,
  });
  const contextOpacity = clamped(frame, T.contextIn);
  const contextEntryScale = interpolate(contextSpring, [0, 1], [0.94, 1]);

  const contextExit = clamped(frame, [T.modalTransition[0], T.modalTransition[0] + 18]);
  const contextFinalOpacity = contextOpacity * (1 - contextExit);
  const contextFinalScale = contextEntryScale * (1 - contextExit * 0.08);

  const quizCardHoverT = clamped(frame, T.quizCardHover);
  let quizCardPress = 1;
  if (frame >= T.quizCardPress[0] && frame <= T.quizCardPress[1]) {
    const t = (frame - T.quizCardPress[0]) / (T.quizCardPress[1] - T.quizCardPress[0]);
    quizCardPress = 1 - 0.06 * Math.sin(Math.PI * t);
  }
  const quizCardGlow = quizCardHoverT;

  const modalIn = spring({
    frame: frame - T.modalTransition[0],
    fps,
    config: { damping: 16, mass: 0.8 },
    durationInFrames: 30,
  });
  const modalEnter = modalIn;

  const cursorStart = { x: width + 40, y: height + 40 };

  let cursorX = cursorStart.x;
  let cursorY = cursorStart.y;
  let cursorScale = 1;
  let rippleScale = 0;
  let rippleOpacity = 0;

  if (frame < T.cursorFlyIn[0]) {
    cursorX = cursorStart.x;
    cursorY = cursorStart.y;
  } else if (frame < T.cursorFlyIn[1]) {
    const t = easeInOut(
      (frame - T.cursorFlyIn[0]) / (T.cursorFlyIn[1] - T.cursorFlyIn[0])
    );
    const p = arcPath(cursorStart, QUIZ_CARD_TARGET, t, 60);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < T.cursorToOptionB[0]) {
    cursorX = QUIZ_CARD_TARGET.x;
    cursorY = QUIZ_CARD_TARGET.y;
  } else if (frame < T.cursorToOptionB[1]) {
    const t = easeInOut(
      (frame - T.cursorToOptionB[0]) /
        (T.cursorToOptionB[1] - T.cursorToOptionB[0])
    );
    const p = arcPath(QUIZ_CARD_TARGET, OPTION_B_TARGET, t, 90);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < T.cursorToFinish[0]) {
    cursorX = OPTION_B_TARGET.x;
    cursorY = OPTION_B_TARGET.y;
  } else if (frame < T.cursorToFinish[1]) {
    const t = easeInOut(
      (frame - T.cursorToFinish[0]) /
        (T.cursorToFinish[1] - T.cursorToFinish[0])
    );
    const p = arcPath(OPTION_B_TARGET, FINISH_BUTTON_TARGET, t, 40);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < T.resultsEnter[0] + 4) {
    cursorX = FINISH_BUTTON_TARGET.x;
    cursorY = FINISH_BUTTON_TARGET.y;
  } else {
    const t = Math.min(1, (frame - (T.resultsEnter[0] + 4)) / 24);
    cursorX = FINISH_BUTTON_TARGET.x + t * 140;
    cursorY = FINISH_BUTTON_TARGET.y + t * 180;
  }

  if (frame >= T.quizCardPress[0] && frame <= T.quizCardPress[1]) {
    const t = (frame - T.quizCardPress[0]) / (T.quizCardPress[1] - T.quizCardPress[0]);
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
    rippleScale = interpolate(t, [0, 1], [0.4, 1.4]);
    rippleOpacity = interpolate(t, [0, 1], [0.6, 0]);
  }
  if (frame >= T.optionBClick[0] && frame <= T.optionBClick[1]) {
    const t = (frame - T.optionBClick[0]) / (T.optionBClick[1] - T.optionBClick[0]);
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
    rippleScale = interpolate(t, [0, 1], [0.4, 1.3]);
    rippleOpacity = interpolate(t, [0, 1], [0.55, 0]);
  }
  if (frame >= T.finishClick[0] && frame <= T.finishClick[1]) {
    const t = (frame - T.finishClick[0]) / (T.finishClick[1] - T.finishClick[0]);
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
    rippleScale = interpolate(t, [0, 1], [0.4, 1.2]);
    rippleOpacity = interpolate(t, [0, 1], [0.5, 0]);
  }

  const cursorFadeOut = clamped(frame, [T.resultsEnter[0], T.resultsEnter[0] + 16]);
  const cursorOpacity = 1 - cursorFadeOut;

  const charsTyped = Math.min(
    QUESTION_TEXT.length,
    Math.max(
      0,
      Math.floor(((frame - T.questionType[0]) * QUESTION_TEXT.length) /
        (T.questionType[1] - T.questionType[0]))
    )
  );

  const caretVisible = Math.floor((frame - T.questionType[0]) / 12) % 2 === 0;

  const optionReveals = OPTIONS.map((_, i) => {
    const start = T.optionsCascade[0] + i * 14;
    return clamped(frame, [start, start + 22]);
  });

  const selectedId = frame >= T.optionBClick[0] ? CORRECT_ID : null;
  const showCorrection = frame >= T.correctionReveal[0];
  const nextButtonHighlight = clamped(frame, [T.correctionReveal[0], T.correctionReveal[1]]);

  const progress = interpolate(
    frame,
    [T.modalTransition[0], T.correctionReveal[1], T.resultsEnter[0]],
    [0.05, 0.1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const showResults = frame >= T.resultsEnter[0];
  const resultsEnter = clamped(frame, T.resultsEnter);
  const questionExit = clamped(frame, [T.resultsEnter[0], T.resultsEnter[0] + 18]);

  const scorePopSpring = spring({
    frame: frame - T.scorePop[0],
    fps,
    config: { damping: 10, mass: 0.8 },
    durationInFrames: 30,
  });
  const scoreScale = interpolate(scorePopSpring, [0, 1], [0.3, 1]);

  const messageReveal = clamped(frame, T.resultsMessage);
  const subtextReveal = clamped(frame, T.resultsSubtext);
  const buttonReveal = clamped(frame, T.resultsButton);

  const finalFade = interpolate(frame, T.fadeOut, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const modalLeft = (width - MODAL_WIDTH) / 2;
  const modalTop = (height - MODAL_HEIGHT) / 2;

  const showModal = frame >= T.modalTransition[0];

  const modalCenterX = modalLeft + MODAL_WIDTH / 2;
  const modalCenterY = modalTop + MODAL_HEIGHT / 2;

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: 640, y: 360, scale: 1.0 },
      { frame: T.cursorFlyIn[1] - 4, x: QUIZ_CARD_TARGET.x, y: QUIZ_CARD_TARGET.y, scale: 1.3 },
      { frame: T.quizCardPress[1], x: QUIZ_CARD_TARGET.x, y: QUIZ_CARD_TARGET.y, scale: 1.35 },
      { frame: T.modalTransition[0] + 15, x: 640, y: 360, scale: 1.0 },
      { frame: T.questionType[0], x: modalCenterX, y: modalTop + 150, scale: 1.25 },
      { frame: T.questionType[1], x: modalCenterX, y: modalTop + 150, scale: 1.25 },
      { frame: T.optionsCascade[0] + 20, x: modalCenterX, y: OPTION_B_TARGET.y, scale: 1.25 },
      { frame: T.optionBClick[0], x: OPTION_B_TARGET.x, y: OPTION_B_TARGET.y, scale: 1.3 },
      { frame: T.correctionReveal[1], x: modalCenterX, y: OPTION_B_TARGET.y + 20, scale: 1.15 },
      { frame: T.finishClick[0], x: FINISH_BUTTON_TARGET.x, y: FINISH_BUTTON_TARGET.y, scale: 1.3 },
      { frame: T.finishClick[1] + 5, x: FINISH_BUTTON_TARGET.x, y: FINISH_BUTTON_TARGET.y, scale: 1.35 },
      { frame: T.resultsEnter[1], x: 640, y: 360, scale: 1.0 },
      { frame: T.hold[1], x: 640, y: 360, scale: 1.0 },
    ],
    { x: 640, y: 360, scale: 1 }
  );

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <Backdrop filterId="quizBlur" />

      <Camera focusX={cam.x} focusY={cam.y} scale={cam.scale}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {!showModal && (
          <CourseContext
            opacity={contextFinalOpacity}
            scale={contextFinalScale}
            quizCardPress={quizCardPress}
            quizCardGlow={quizCardGlow}
          />
        )}
      </AbsoluteFill>

      {showModal && (
        <div
          style={{
            position: "absolute",
            left: modalLeft,
            top: modalTop,
            pointerEvents: "none",
          }}
        >
          <QuizModal
            enter={modalEnter}
            progress={progress}
            hideProgressBar={showResults}
          >
            {!showResults ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  opacity: 1 - questionExit,
                }}
              >
                <QuestionView
                  questionChars={charsTyped}
                  optionReveals={optionReveals}
                  selectedId={selectedId}
                  showCorrection={showCorrection}
                  nextButtonHighlight={nextButtonHighlight}
                  caretVisible={caretVisible}
                />
              </div>
            ) : (
              <ResultsView
                enter={resultsEnter}
                scoreValue={100}
                scoreScale={scoreScale}
                messageReveal={messageReveal}
                subtextReveal={subtextReveal}
                buttonReveal={buttonReveal}
              />
            )}
          </QuizModal>
        </div>
      )}

      {frame >= T.confettiStart && (
        <Confetti
          startFrame={T.confettiStart}
          duration={110}
          originX={width / 2}
          originY={height / 2 - 40}
        />
      )}

      {cursorOpacity > 0 && (
        <div style={{ opacity: cursorOpacity }}>
          <Cursor
            x={cursorX}
            y={cursorY}
            scale={cursorScale}
            rippleScale={rippleScale}
            rippleOpacity={rippleOpacity}
          />
        </div>
      )}
      </Camera>
    </AbsoluteFill>
  );
};
