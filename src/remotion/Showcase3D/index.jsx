import { AbsoluteFill, Sequence, useCurrentFrame, Easing } from "remotion";
import { Stage3D, Layer, useStagePath } from "./Stage3D";
import { ScreenPanel } from "./ScreenPanel";
import { AmbientRoom } from "./AmbientRoom";
import { XpAccent, StreakAccent, BoltAccent } from "./Accents";
import { Grain } from "./Grain";
import { SetYourGoal } from "../SetYourGoal";
import { LearnWithAITutor } from "../LearnWithAITutor";
import { QuizScene } from "../QuizScene";
import { GamifiedMotivation } from "../GamifiedMotivation";
import { CommunityQuestion } from "../CommunityQuestion";

const SCENES = {
  SetYourGoal,
  LearnWithAITutor,
  QuizScene,
  GamifiedMotivation,
  CommunityQuestion,
};

export const SHOWCASE_DURATION = 150;

const DRIFT = [
  { frame: 0, ry: -19, rx: 9, rz: -1.2, z: -420, x: 22, y: -8, originX: 47, originY: 43 },
  {
    frame: SHOWCASE_DURATION,
    ry: -11,
    rx: 6,
    rz: -0.4,
    z: -350,
    x: -14,
    y: 6,
    originX: 53,
    originY: 47,
  },
];

export const Showcase3D = ({ scene = "QuizScene", startAt = 0 }) => {
  const frame = useCurrentFrame();
  const Scene = SCENES[scene] ?? SCENES.QuizScene;

  // Linear, not the house bezier: an eased drift decelerates into the last
  // frame, which leaves the editor unable to cut anywhere but the head.
  const stage = useStagePath(frame, DRIFT, undefined, Easing.linear);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070f", isolation: "isolate" }}>
      <AmbientRoom />

      <Stage3D
        perspective={1600}
        originX={stage.originX}
        originY={stage.originY}
        rx={stage.rx}
        ry={stage.ry}
        rz={stage.rz}
        x={stage.x}
        y={stage.y}
        z={stage.z}
      >
        <Layer z={0}>
          <ScreenPanel>
            {/* Negative offset drops us into the middle of the source scene,
                so a 150-frame composition can hold the one beat worth cutting. */}
            <Sequence from={-startAt}>
              <Scene />
            </Sequence>
          </ScreenPanel>
        </Layer>

        <Layer z={120}>
          <XpAccent frame={frame} x={1044} y={198} />
        </Layer>
        <Layer z={220}>
          <StreakAccent frame={frame} x={236} y={556} />
        </Layer>
        <Layer z={320}>
          <BoltAccent frame={frame} x={1108} y={566} />
        </Layer>
      </Stage3D>

      <Grain frame={frame} />
    </AbsoluteFill>
  );
};
