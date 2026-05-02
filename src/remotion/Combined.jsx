import { Series } from "remotion";
import { SetYourGoal } from "./SetYourGoal";
import { LearnWithAITutor } from "./LearnWithAITutor";
import { QuizScene } from "./QuizScene";
import { GamifiedMotivation } from "./GamifiedMotivation";
import { CommunityQuestion } from "./CommunityQuestion";

export const SCENE_DURATIONS = {
  SetYourGoal: 330,
  LearnWithAITutor: 390,
  QuizScene: 450,
  GamifiedMotivation: 390,
  CommunityQuestion: 360,
};

export const COMBINED_DURATION =
  SCENE_DURATIONS.SetYourGoal +
  SCENE_DURATIONS.LearnWithAITutor +
  SCENE_DURATIONS.QuizScene +
  SCENE_DURATIONS.GamifiedMotivation +
  SCENE_DURATIONS.CommunityQuestion;

export const Combined = () => (
  <Series>
    <Series.Sequence durationInFrames={SCENE_DURATIONS.SetYourGoal}>
      <SetYourGoal />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENE_DURATIONS.LearnWithAITutor}>
      <LearnWithAITutor />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENE_DURATIONS.QuizScene}>
      <QuizScene />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENE_DURATIONS.GamifiedMotivation}>
      <GamifiedMotivation />
    </Series.Sequence>
    <Series.Sequence durationInFrames={SCENE_DURATIONS.CommunityQuestion}>
      <CommunityQuestion />
    </Series.Sequence>
  </Series>
);
