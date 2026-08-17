import { Series } from "remotion";
import { SetYourGoal, SET_YOUR_GOAL_DURATION } from "./SetYourGoal";
import {
  LearnWithAITutor,
  LEARN_WITH_AI_TUTOR_DURATION,
} from "./LearnWithAITutor";
import { QuizScene, QUIZ_SCENE_DURATION } from "./QuizScene";
import { GamifiedMotivation } from "./GamifiedMotivation";
import { CommunityQuestion } from "./CommunityQuestion";

export const SCENE_DURATIONS = {
  SetYourGoal: SET_YOUR_GOAL_DURATION,
  LearnWithAITutor: LEARN_WITH_AI_TUTOR_DURATION,
  QuizScene: QUIZ_SCENE_DURATION,
  GamifiedMotivation: 390,
  CommunityQuestion: 430,
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
