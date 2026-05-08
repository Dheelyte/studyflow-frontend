import { Composition } from "remotion";
import { SetYourGoal } from "./SetYourGoal";
import { LearnWithAITutor } from "./LearnWithAITutor";
import { QuizScene } from "./QuizScene";
import { GamifiedMotivation } from "./GamifiedMotivation";
import { CommunityQuestion } from "./CommunityQuestion";
import { Combined, COMBINED_DURATION } from "./Combined";

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
      durationInFrames={330}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="LearnWithAITutor"
      component={LearnWithAITutor}
      durationInFrames={390}
      fps={30}
      width={1280}
      height={720}
    />
    <Composition
      id="QuizScene"
      component={QuizScene}
      durationInFrames={450}
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
  </>
);
