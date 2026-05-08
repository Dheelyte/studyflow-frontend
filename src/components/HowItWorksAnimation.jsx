"use client";
import { useEffect, useRef } from "react";
import { Player } from "@remotion/player";
import { SetYourGoal } from "@/remotion/SetYourGoal";
import { LearnWithAITutor } from "@/remotion/LearnWithAITutor";
import { QuizScene } from "@/remotion/QuizScene";
import { GamifiedMotivation } from "@/remotion/GamifiedMotivation";
import { CommunityQuestion } from "@/remotion/CommunityQuestion";
import styles from "./HowItWorksAnimation.module.css";

const SCENES = {
    setYourGoal: {
        component: SetYourGoal,
        durationInFrames: 330,
    },
    learnWithAITutor: {
        component: LearnWithAITutor,
        durationInFrames: 390,
    },
    quiz: {
        component: QuizScene,
        durationInFrames: 450,
    },
    gamifiedMotivation: {
        component: GamifiedMotivation,
        durationInFrames: 390,
    },
    communityQuestion: {
        component: CommunityQuestion,
        durationInFrames: 430,
    },
};

export default function HowItWorksAnimation({ scene = "setYourGoal" }) {
    const { component, durationInFrames } = SCENES[scene] ?? SCENES.setYourGoal;
    const playerRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const target = wrapperRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const player = playerRef.current;
                if (!player) return;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
                    player.play();
                } else {
                    player.pause();
                }
            },
            { threshold: [0, 0.95, 1] }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={wrapperRef} className={styles.wrapper}>
            <div className={styles.player}>
                <Player
                    ref={playerRef}
                    component={component}
                    durationInFrames={durationInFrames}
                    fps={30}
                    compositionWidth={1280}
                    compositionHeight={720}
                    style={{ width: "100%", height: "100%" }}
                    loop
                    controls={false}
                    clickToPlay={false}
                />
            </div>
        </div>
    );
}
