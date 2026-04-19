import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Backdrop } from "../SetYourGoal/Backdrop";
import { CommunityHeader, HEADER_HEIGHT } from "./CommunityHeader";
import { PostCard, POST_WIDTH } from "./PostCard";
import { Comment } from "./Comment";
import { FloatingHearts } from "./FloatingHeart";
import { Camera, useCameraPath } from "../Camera";

const QUESTION =
  "How do you handle missing values in a large DataFrame? Torn between dropna() and smart imputation — what's your go-to?";

const COMMENTS = [
  {
    author: "Maya K.",
    initials: "MK",
    avatarGradient: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    time: "12s",
    content: "Use SimpleImputer with median — saves your pipeline.",
  },
  {
    author: "Jordan S.",
    initials: "JS",
    avatarGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    time: "28s",
    content: "Plot missingness first — tells you if it's MCAR.",
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
  cardIn: [25, 55],
  typeStart: 55,
  typeEnd: 140,
  likePulse: [142, 158],
  likeCount: [142, 215],
  heartsStart: 148,
  comment1: [175, 200],
  comment2: [220, 245],
  comment3: [265, 290],
  hold: [290, 330],
  fadeOut: [330, 360],
};

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

  const heartsOriginX = headerLeft + 34;
  const heartsOriginY = cardTop + 190;

  const postCenterX = headerLeft + POST_WIDTH / 2;
  const nameMembersFocusX = headerLeft + 210;
  const nameMembersFocusY = headerTop + HEADER_HEIGHT / 2 - 2;
  const questionY = cardTop + 120;
  const commentsY = cardTop + 320;

  const cam = useCameraPath(
    frame,
    [
      { frame: 0, x: nameMembersFocusX, y: nameMembersFocusY, scale: 3.3 },
      { frame: T.typeStart, x: nameMembersFocusX, y: nameMembersFocusY, scale: 3.3 },
      { frame: T.typeStart + 50, x: postCenterX, y: questionY, scale: 1.55 },
      { frame: T.typeEnd, x: postCenterX, y: questionY + 10, scale: 1.55 },
      { frame: T.comment1[0] + 30, x: postCenterX, y: commentsY, scale: 1.45 },
      { frame: T.comment3[0], x: postCenterX, y: commentsY + 40, scale: 1.4 },
      { frame: T.fadeOut[1], x: postCenterX, y: commentsY + 40, scale: 1.4 },
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
        <CommunityHeader opacity={headerOpacity} />
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
      </Camera>
    </AbsoluteFill>
  );
};
