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
import {
  PracticeProject,
  PROJECT_WIDTH,
  PROJECT_HEIGHT,
  PROJECT_LINK,
  PROJECT_BRIEF,
  REQ_ROWS,
  REQ_CHECK_X,
  LINK_FIELD,
  SAVE_BTN,
} from "./PracticeProject";
import { Camera, useCameraPath } from "../Camera";
import { ZapIcon } from "../icons";

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

  // Practice build — the module's project, self-marked. Same modal as the quiz,
  // and the same beat order: type the brief, then reveal what's below it.
  projectHandoff: [402, 416],
  projectIn: [414, 436],
  briefType: [436, 506],
  // Checklist fades up row by row once the brief has finished typing.
  reqReveal: [510, 556],
  tick1: 568,
  tick2: 584,
  tick3: 600,
  linkType: [612, 648],
  saveClick: 658,
  // Starts once the cursor is clear of it (see the exit window below).
  doneBanner: [676, 694],
  hold: [694, 724],
  fadeOut: [724, 738],
};

const REQ_REVEAL_STAGGER = 12;
const REQ_REVEAL_FRAMES = 22;

export const QUIZ_SCENE_DURATION = 738;

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

  // Declared above the cursor path because it reads them.
  const projectLeft = (width - PROJECT_WIDTH) / 2;
  const projectTop = (height - PROJECT_HEIGHT) / 2;
  const reqTargets = REQ_ROWS.map((y) => ({
    x: projectLeft + REQ_CHECK_X,
    y: projectTop + y,
  }));
  const linkTarget = {
    x: projectLeft + LINK_FIELD.x,
    y: projectTop + LINK_FIELD.y,
  };
  const saveTarget = { x: projectLeft + SAVE_BTN.x, y: projectTop + SAVE_BTN.y };

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
  } else if (frame < T.tick1 - 40) {
    const t = Math.min(1, (frame - (T.resultsEnter[0] + 4)) / 24);
    cursorX = FINISH_BUTTON_TARGET.x + t * 140;
    cursorY = FINISH_BUTTON_TARGET.y + t * 180;
  } else if (frame < T.tick1) {
    // Comes back only once the checklist is on screen to be ticked.
    const t = easeInOut(clamped(frame, [T.tick1 - 40, T.tick1]));
    const p = arcPath({ x: width + 60, y: height + 60 }, reqTargets[0], t, 70);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < T.tick2) {
    const t = easeInOut(clamped(frame, [T.tick1 + 4, T.tick2]));
    cursorX = interpolate(t, [0, 1], [reqTargets[0].x, reqTargets[1].x]);
    cursorY = interpolate(t, [0, 1], [reqTargets[0].y, reqTargets[1].y]);
  } else if (frame < T.tick3) {
    const t = easeInOut(clamped(frame, [T.tick2 + 4, T.tick3]));
    cursorX = interpolate(t, [0, 1], [reqTargets[1].x, reqTargets[2].x]);
    cursorY = interpolate(t, [0, 1], [reqTargets[1].y, reqTargets[2].y]);
  } else if (frame < T.linkType[0]) {
    const t = easeInOut(clamped(frame, [T.tick3 + 4, T.linkType[0]]));
    cursorX = interpolate(t, [0, 1], [reqTargets[2].x, linkTarget.x - 180]);
    cursorY = interpolate(t, [0, 1], [reqTargets[2].y, linkTarget.y]);
  } else if (frame < T.linkType[1]) {
    cursorX = linkTarget.x - 180;
    cursorY = linkTarget.y;
  } else if (frame < T.saveClick) {
    const t = easeInOut(clamped(frame, [T.linkType[1], T.saveClick]));
    cursorX = interpolate(t, [0, 1], [linkTarget.x - 180, saveTarget.x]);
    cursorY = interpolate(t, [0, 1], [linkTarget.y, saveTarget.y]);
  } else if (frame < T.saveClick + 12) {
    cursorX = saveTarget.x;
    cursorY = saveTarget.y;
  } else {
    // Leaves as soon as the click ripple finishes, so it isn't sat on the
    // completion banner that replaces the button.
    const t = easeInOut(clamped(frame, [T.saveClick + 12, T.saveClick + 32]));
    cursorX = interpolate(t, [0, 1], [saveTarget.x, width + 60]);
    cursorY = interpolate(t, [0, 1], [saveTarget.y, height + 60]);
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
  [T.tick1, T.tick2, T.tick3, T.saveClick].forEach((at) => {
    if (frame >= at && frame <= at + 12) {
      const t = (frame - at) / 12;
      cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
      rippleScale = interpolate(t, [0, 1], [0.4, 1.3]);
      rippleOpacity = interpolate(t, [0, 1], [0.55, 0]);
    }
  });

  const cursorFadeOut = clamped(frame, [T.resultsEnter[0], T.resultsEnter[0] + 16]);
  // Comes back for the project, having left after the quiz was submitted.
  const cursorReturn = clamped(frame, [T.tick1 - 44, T.tick1 - 30]);
  const cursorOpacity = Math.max(1 - cursorFadeOut, cursorReturn);

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

  const resultsHandoff = clamped(frame, T.projectHandoff);
  const projectEnter = clamped(frame, T.projectIn);
  const projectBriefChars = Math.round(
    interpolate(frame, T.briefType, [0, PROJECT_BRIEF.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  // Staggered fade-up, the checklist equivalent of the option cascade above.
  const projectReqReveals = [0, 1, 2].map((i) => {
    const start = T.reqReveal[0] + i * REQ_REVEAL_STAGGER;
    return clamped(frame, [start, start + REQ_REVEAL_FRAMES]);
  });
  const projectChecks = [T.tick1, T.tick2, T.tick3].map((at) =>
    clamped(frame, [at, at + 10])
  );
  const projectLinkChars = Math.round(
    interpolate(frame, T.linkType, [0, PROJECT_LINK.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const projectDone = clamped(frame, T.doneBanner);
  const projectCaretVisible = Math.floor(frame / 10) % 2 === 0;
  let saveScale = 1;
  if (frame >= T.saveClick && frame < T.saveClick + 12) {
    saveScale = 1 - 0.14 * Math.sin(((frame - T.saveClick) / 12) * Math.PI);
  }

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
      { frame: T.cursorFlyIn[1] - 14, x: QUIZ_CARD_TARGET.x, y: QUIZ_CARD_TARGET.y, scale: 1.32 },
      { frame: T.quizCardPress[1], x: QUIZ_CARD_TARGET.x, y: QUIZ_CARD_TARGET.y, scale: 1.36 },
      { frame: T.modalTransition[0] + 8, x: 640, y: 360, scale: 1.0 },
      { frame: T.questionType[0], x: modalCenterX, y: modalTop + 150, scale: 1.28 },
      { frame: T.questionType[1], x: modalCenterX, y: modalTop + 150, scale: 1.28 },
      { frame: T.optionsCascade[0] + 18, x: modalCenterX, y: OPTION_B_TARGET.y, scale: 1.28 },
      { frame: T.optionBClick[0], x: OPTION_B_TARGET.x, y: OPTION_B_TARGET.y, scale: 1.34 },
      { frame: T.correctionReveal[1], x: modalCenterX, y: OPTION_B_TARGET.y + 20, scale: 1.15 },
      { frame: T.finishClick[0], x: FINISH_BUTTON_TARGET.x, y: FINISH_BUTTON_TARGET.y, scale: 1.32 },
      { frame: T.finishClick[1] + 5, x: FINISH_BUTTON_TARGET.x, y: FINISH_BUTTON_TARGET.y, scale: 1.36 },
      { frame: T.resultsEnter[1], x: 640, y: 360, scale: 1.0 },
      // The project is the modal now (640x560, centred), so these zooms are
      // bounded by what keeps the panel inside the frame: at scale s the
      // visible half-height is 360/s, so focus y must stay in [360/s, 720-360/s].
      { frame: T.projectIn[0], x: 640, y: 360, scale: 1.0 },
      // 1.28 on focus y 361 sits the 560-tall modal exactly in the frame, so
      // the brief and the checklist under it are both in shot throughout.
      { frame: T.briefType[0], x: 640, y: 361, scale: 1.28 },
      { frame: T.tick3 + 10, x: 640, y: 361, scale: 1.28 },
      // Closer for the link field and the button beneath it.
      { frame: T.linkType[0], x: 640, y: 400, scale: 1.34 },
      { frame: T.saveClick, x: 640, y: 400, scale: 1.34 },
      { frame: T.doneBanner[1], x: 640, y: 380, scale: 1.2 },
      { frame: T.hold[1], x: 640, y: 380, scale: 1.2 },
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

      {showModal && resultsHandoff < 1 && (
        <div
          style={{
            position: "absolute",
            left: modalLeft,
            top: modalTop,
            pointerEvents: "none",
            opacity: 1 - resultsHandoff,
            transform: `scale(${1 - resultsHandoff * 0.05})`,
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

      {projectEnter > 0 && (
        <div
          style={{
            position: "absolute",
            left: projectLeft,
            top: projectTop,
            pointerEvents: "none",
          }}
        >
          {/* Same modal the quiz ran in, so the project reads as the next beat
              of the module rather than a different surface. */}
          <QuizModal
            enter={projectEnter}
            hideProgressBar
            title="Data Cleaning Practice Project"
            icon={<ZapIcon size={22} color="#6366f1" />}
          >
            <PracticeProject
              briefChars={projectBriefChars}
              reqReveals={projectReqReveals}
              checks={projectChecks}
              linkTyped={PROJECT_LINK.slice(0, projectLinkChars)}
              caretVisible={projectCaretVisible}
              saveScale={saveScale}
              done={projectDone}
            />
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
