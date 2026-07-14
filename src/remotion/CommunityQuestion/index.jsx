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
  CommunityHeader,
  HEADER_HEIGHT,
  HEADER_WIDTH,
  JOIN_BUTTON_OFFSET_X,
  JOIN_BUTTON_OFFSET_Y,
} from "./CommunityHeader";
import { PostCard, POST_WIDTH } from "./PostCard";
import { Comment } from "./Comment";
import { FloatingHearts } from "./FloatingHeart";
import { Camera, useCameraPath } from "../Camera";

const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const arcPath = (from, to, t, lift = 60) => {
  const x = from.x + (to.x - from.x) * t;
  const yLinear = from.y + (to.y - from.y) * t;
  const arc = -Math.sin(Math.PI * t) * lift;
  return { x, y: yLinear + arc };
};

const QUESTION =
  "How do you handle missing values in a large DataFrame? Torn between dropna() and smart imputation - what's your go-to?";

const COMMENTS = [
  {
    author: "Maya K.",
    initials: "MK",
    avatarGradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    time: "12s",
    content: "Use SimpleImputer with median - saves your pipeline.",
  },
  {
    author: "Jordan S.",
    initials: "JS",
    avatarGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    time: "28s",
    content: "Plot missingness first - tells you if it's MCAR.",
  },
  {
    author: "Priya N.",
    initials: "PN",
    avatarGradient: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    time: "41s",
    content: "Time series? groupby + ffill() keeps the signal clean.",
  },
];

const T = {
  headerIn: [12, 36],
  joinCursorIn: [60, 90],
  joinClick: [88, 102],
  cardIn: [92, 122],
  typeStart: 122,
  typeEnd: 207,
  likePulse: [209, 225],
  likeCount: [209, 282],
  heartsStart: 215,
  comment1: [242, 267],
  comment2: [287, 312],
  comment3: [332, 357],
  hold: [357, 397],
  fadeOut: [397, 427],
};

const JOIN_PRESS_FRAME = 94;

const clamped = (frame, [a, b]) =>
  interpolate(frame, [a, b], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const FINAL_LIKES = 124;

export const CommunityQuestion = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const headerSpring = spring({
    frame: frame - T.headerIn[0],
    fps,
    config: { damping: 14, mass: 0.7 },
    durationInFrames: 24,
  });
  const headerOpacity = headerSpring;

  const cardSpring = spring({
    frame: frame - T.cardIn[0],
    fps,
    config: { damping: 16, mass: 0.8 },
    durationInFrames: 28,
  });
  const cardOpacity = cardSpring;
  const cardLift = interpolate(cardSpring, [0, 1], [28, 0]);

  const typeSpan = T.typeEnd - T.typeStart;
  const charsPerFrame = QUESTION.length / typeSpan;
  const charsTyped =
    frame < T.typeStart
      ? 0
      : Math.min(QUESTION.length, Math.floor((frame - T.typeStart) * charsPerFrame));
  const typedContent = QUESTION.slice(0, charsTyped);
  const isTyping = charsTyped > 0 && charsTyped < QUESTION.length;
  const caretVisible = Math.floor((frame - T.typeStart) / 12) % 2 === 0;

  const likeProgress = clamped(frame, T.likeCount);
  const likes = Math.round(likeProgress * FINAL_LIKES);
  const liked = frame >= T.likePulse[0];

  let likeScale = 1;
  if (frame >= T.likePulse[0] && frame <= T.likePulse[1]) {
    const t = (frame - T.likePulse[0]) / (T.likePulse[1] - T.likePulse[0]);
    likeScale = 1 + 0.45 * Math.sin(Math.PI * t);
  }

  const comment1Reveal = clamped(frame, T.comment1);
  const comment2Reveal = clamped(frame, T.comment2);
  const comment3Reveal = clamped(frame, T.comment3);

  let commentCount = 0;
  if (frame >= T.comment1[0]) commentCount = 1;
  if (frame >= T.comment2[0]) commentCount = 2;
  if (frame >= T.comment3[0]) commentCount = 3;

  let commentIconBounce = 0;
  const bounceWindows = [T.comment1[0], T.comment2[0], T.comment3[0]];
  for (const b of bounceWindows) {
    if (frame >= b && frame < b + 12) {
      const t = (frame - b) / 12;
      commentIconBounce = Math.sin(Math.PI * t);
    }
  }

  const finalFade = interpolate(frame, T.fadeOut, [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showComments = comment1Reveal > 0;

  const headerLeft = (width - POST_WIDTH) / 2;
  const headerTop = 64;
  const cardTop = headerTop + HEADER_HEIGHT + 20;

  const joined = frame >= JOIN_PRESS_FRAME;

  let joinScale = 1;
  let joinFlash = 0;
  if (frame >= T.joinClick[0] && frame <= T.joinClick[1]) {
    const t = (frame - T.joinClick[0]) / (T.joinClick[1] - T.joinClick[0]);
    if (t < 0.35) {
      joinScale = interpolate(t, [0, 0.35], [1, 0.9]);
    } else if (t < 0.7) {
      joinScale = interpolate(t, [0.35, 0.7], [0.9, 1.08]);
    } else {
      joinScale = interpolate(t, [0.7, 1], [1.08, 1]);
    }
    joinFlash = Math.sin(t * Math.PI);
  }

  const joinButtonX = headerLeft + JOIN_BUTTON_OFFSET_X;
  const joinButtonY = headerTop + JOIN_BUTTON_OFFSET_Y;

  const cursorStart = { x: width + 60, y: height + 60 };
  let cursorX = cursorStart.x;
  let cursorY = cursorStart.y;
  let cursorScale = 1;
  let rippleScale = 0;
  let rippleOpacity = 0;
  let cursorOpacity = 0;

  if (frame >= T.joinCursorIn[0]) {
    cursorOpacity = 1;
  }
  if (frame < T.joinCursorIn[0]) {
    cursorX = cursorStart.x;
    cursorY = cursorStart.y;
  } else if (frame < T.joinCursorIn[1]) {
    const t = easeInOut(
      (frame - T.joinCursorIn[0]) /
        (T.joinCursorIn[1] - T.joinCursorIn[0])
    );
    const p = arcPath(cursorStart, { x: joinButtonX, y: joinButtonY }, t, 80);
    cursorX = p.x;
    cursorY = p.y;
  } else if (frame < T.cardIn[1]) {
    cursorX = joinButtonX;
    cursorY = joinButtonY;
  } else {
    const t = Math.min(
      1,
      (frame - T.cardIn[1]) / 24
    );
    cursorX = interpolate(t, [0, 1], [joinButtonX, width + 80]);
    cursorY = interpolate(t, [0, 1], [joinButtonY, height + 120]);
    cursorOpacity = 1 - t;
  }

  if (frame >= T.joinClick[0] && frame <= T.joinClick[1]) {
    const t = (frame - T.joinClick[0]) / (T.joinClick[1] - T.joinClick[0]);
    cursorScale = 1 - 0.2 * Math.sin(Math.PI * t);
    rippleScale = interpolate(t, [0, 1], [0.4, 1.3]);
    rippleOpacity = interpolate(t, [0, 1], [0.6, 0]);
  }

  const heartsOriginX = headerLeft + 34;
  const heartsOriginY = cardTop + 190;

  const postCenterX = headerLeft + POST_WIDTH / 2;
  const headerFocusX = headerLeft + HEADER_WIDTH / 2;
  const nameMembersFocusY = headerTop + HEADER_HEIGHT / 2 - 2;
  const questionY = cardTop + 120;
  const commentsY = cardTop + 320;

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: headerFocusX, y: nameMembersFocusY, scale: 2.4 },
      { frame: T.headerIn[1], x: headerFocusX, y: nameMembersFocusY, scale: 2.4 },
      { frame: T.joinClick[1], x: headerFocusX, y: nameMembersFocusY, scale: 2.4 },
      { frame: T.typeStart, x: headerFocusX, y: nameMembersFocusY, scale: 2.2 },
      { frame: T.typeStart + 50, x: postCenterX, y: questionY, scale: 2.1 },
      { frame: T.typeEnd, x: postCenterX, y: questionY + 10, scale: 2.1 },
      { frame: T.comment1[0] + 30, x: postCenterX, y: commentsY, scale: 1.95 },
      { frame: T.comment3[0], x: postCenterX, y: commentsY + 40, scale: 1.9 },
      { frame: T.fadeOut[1], x: postCenterX, y: commentsY + 40, scale: 1.9 },
    ],
    { x: 640, y: 360, scale: 1 }
  );

  return (
    <AbsoluteFill style={{ opacity: finalFade }}>
      <Backdrop filterId="communityBlur" />

      <Camera focusX={cam.x} focusY={cam.y} scale={cam.scale}>
      <div
        style={{
          position: "absolute",
          left: headerLeft,
          top: headerTop,
        }}
      >
        <CommunityHeader
          opacity={headerOpacity}
          joined={joined}
          joinScale={joinScale}
          joinFlash={joinFlash}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: headerLeft,
          top: cardTop,
        }}
      >
        <PostCard
          typedContent={typedContent}
          caretVisible={caretVisible}
          isTyping={isTyping}
          likes={likes}
          liked={liked}
          likeScale={likeScale}
          commentCount={commentCount}
          commentIconBounce={commentIconBounce}
          opacity={cardOpacity}
          lift={cardLift}
        >
          {showComments && (
            <div
              style={{
                marginTop: 20,
                paddingTop: 18,
                borderTop: "1px solid rgba(99, 102, 241, 0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <Comment {...COMMENTS[0]} reveal={comment1Reveal} />
              {comment2Reveal > 0 && (
                <Comment {...COMMENTS[1]} reveal={comment2Reveal} />
              )}
              {comment3Reveal > 0 && (
                <Comment {...COMMENTS[2]} reveal={comment3Reveal} />
              )}
            </div>
          )}
        </PostCard>
      </div>

      <FloatingHearts
        startFrame={T.heartsStart}
        originX={heartsOriginX}
        originY={heartsOriginY}
        active={frame >= T.heartsStart && frame < T.heartsStart + 80}
      />

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
