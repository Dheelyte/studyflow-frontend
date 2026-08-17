import { Composition } from "remotion";
import { SetYourGoal, SET_YOUR_GOAL_DURATION } from "./SetYourGoal";
import {
  LearnWithAITutor,
  LEARN_WITH_AI_TUTOR_DURATION,
} from "./LearnWithAITutor";
import { QuizScene, QUIZ_SCENE_DURATION } from "./QuizScene";
import { GamifiedMotivation } from "./GamifiedMotivation";
import { CommunityQuestion } from "./CommunityQuestion";
import { Combined, COMBINED_DURATION } from "./Combined";
import { Showcase3D, SHOWCASE_DURATION } from "./Showcase3D";

// Ad-only. These are rendered to file for the launch film; the landing page
// keeps playing the flat scenes through @remotion/player.
const SHOWCASE_WINDOWS = [
  { id: "Showcase3D-Quiz", scene: "QuizScene", startAt: 205 },
  { id: "Showcase3D-Streak", scene: "GamifiedMotivation", startAt: 40 },
  // The screen-tutor beat: capture, ring the problem, ask, answer.
  { id: "Showcase3D-Tutor", scene: "LearnWithAITutor", startAt: 414 },
];

export const RemotionRoot = () => (
  <>
    <Composition
      id="Combined"
      component={Combined}
      durationInFrames={COMBINED_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="SetYourGoal"
      component={SetYourGoal}
      durationInFrames={SET_YOUR_GOAL_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="LearnWithAITutor"
      component={LearnWithAITutor}
      durationInFrames={LEARN_WITH_AI_TUTOR_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="QuizScene"
      component={QuizScene}
      durationInFrames={QUIZ_SCENE_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="GamifiedMotivation"
      component={GamifiedMotivation}
      durationInFrames={390}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="CommunityQuestion"
      component={CommunityQuestion}
      durationInFrames={430}
      fps={30}
      width={1280}
      height={720}
    />

    {SHOWCASE_WINDOWS.map(({ id, scene, startAt }) => (
      <Composition
        key={id}
        id={id}
        component={Showcase3D}
        durationInFrames={SHOWCASE_DURATION}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{ scene, startAt }}
      />
    ))}
  </>
);
