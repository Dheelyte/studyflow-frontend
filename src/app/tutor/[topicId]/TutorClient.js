"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { ChevronLeft, VideoIcon, CheckCircleIcon, ZapIcon } from "@/components/Icons";

// Help icon (question mark in circle)
const HelpIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

// Lightbulb icon for the panel
const LightbulbIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6"></path>
        <path d="M10 22h4"></path>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
    </svg>
);

export default function TutorClient({ params }) {
    const resolvedParams = React.use(params);
    const topicId = resolvedParams?.topicId;
    const router = useRouter();

    const [videoId, setVideoId] = useState(null);
    const [topicTitle, setTopicTitle] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [playerReady, setPlayerReady] = useState(false);
    const [explaining, setExplaining] = useState(false);
    const [explanation, setExplanation] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completing, setCompleting] = useState(false);

    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const ytScriptLoaded = useRef(false);

    // Fetch video data for this topic
    useEffect(() => {
        if (!topicId) return;

        const fetchVideo = async () => {
            try {
                setLoading(true);
                const data = await curriculum.getTopicVideo(topicId);
                setVideoId(data.youtube_video_id);
                if (data.title) setTopicTitle(data.title);
                if (data.description) setTopicDescription(data.description);
            } catch (err) {
                console.error("Failed to fetch topic video:", err);
                setError(err.message || "Failed to load video");
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [topicId]);

    // Load YouTube IFrame API and create player once videoId is available
    const initPlayer = useCallback(() => {
        if (!videoId || !playerContainerRef.current) return;
        if (playerRef.current) {
            // Player already exists, just load new video
            playerRef.current.loadVideoById(videoId);
            return;
        }

        const createPlayer = () => {
            playerRef.current = new window.YT.Player(playerContainerRef.current, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    modestbranding: 1,
                    rel: 0,
                    fs: 1,
                },
                events: {
                    onReady: () => setPlayerReady(true),
                },
            });
        };

        if (window.YT && window.YT.Player) {
            createPlayer();
            return;
        }

        if (!ytScriptLoaded.current) {
            ytScriptLoaded.current = true;
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = createPlayer;
    }, [videoId]);

    useEffect(() => {
        initPlayer();

        return () => {
            if (playerRef.current && typeof playerRef.current.destroy === "function") {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [initPlayer]);

    // "I don't understand" handler
    const handleExplain = async () => {
        if (!videoId || explaining) return;

        let timestamp = 0;
        if (playerRef.current && typeof playerRef.current.getCurrentTime === "function") {
            playerRef.current.pauseVideo();
            timestamp = playerRef.current.getCurrentTime();
        }

        try {
            setExplaining(true);
            setExplanation(null);
            const data = await curriculum.explainTopic(topicId, {
                video_id: videoId,
                timestamp: Math.round(timestamp),
            });
            setExplanation(data);
        } catch (err) {
            console.error("Failed to get explanation:", err);
            setExplanation({
                explanation: "Sorry, I couldn't generate an explanation right now. Please try again.",
                transcript_excerpt: null,
            });
        } finally {
            setExplaining(false);
        }
    };

    // Mark complete handler
    const handleComplete = async () => {
        if (completing || isCompleted) return;

        try {
            setCompleting(true);
            await curriculum.completeTopic(topicId);
            setIsCompleted(true);
        } catch (err) {
            console.error("Failed to mark topic complete:", err);
        } finally {
            setCompleting(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.inner}>
                    <div className={styles.topBar}>
                        <button className={styles.backButton} onClick={handleBack}>
                            <ChevronLeft size={20} /> Back
                        </button>
                    </div>
                    <div className={styles.layout}>
                        <div className={styles.videoSection}>
                            <div className={styles.playerWrapper}>
                                <div className={styles.playerPlaceholder}>
                                    <VideoIcon size={48} />
                                    <span>Loading video...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorState}>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button className={styles.retryButton} onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {/* Top bar */}
                <div className={styles.topBar}>
                    <button className={styles.backButton} onClick={handleBack}>
                        <ChevronLeft size={20} /> Back to Course
                    </button>
                    <span className={styles.topicTitle}>{topicTitle}</span>
                    <button
                        className={`${styles.completeButton} ${isCompleted ? styles.completedButton : ""}`}
                        onClick={handleComplete}
                        disabled={completing || isCompleted}
                    >
                        {isCompleted ? (
                            <><CheckCircleIcon size={18} /> Completed</>
                        ) : completing ? (
                            "Saving..."
                        ) : (
                            <><CheckCircleIcon size={18} /> Mark Complete</>
                        )}
                    </button>
                </div>

                {/* Main layout */}
                <div className={styles.layout}>
                    {/* Video section */}
                    <div className={styles.videoSection}>
                        <div className={styles.playerWrapper}>
                            {videoId ? (
                                <div ref={playerContainerRef} style={{ width: "100%", height: "100%" }} />
                            ) : (
                                <div className={styles.playerPlaceholder}>
                                    <VideoIcon size={48} />
                                    <span>No video available for this topic</span>
                                </div>
                            )}
                        </div>

                        <div className={styles.videoControls}>
                            <button
                                className={styles.helpButton}
                                onClick={handleExplain}
                                disabled={explaining || !videoId}
                            >
                                <HelpIcon size={20} />
                                {explaining ? "Thinking..." : "I don't understand this part"}
                            </button>
                        </div>

                        {topicDescription && (
                            <div className={styles.topicDescription}>
                                <strong>About this topic:</strong> {topicDescription}
                            </div>
                        )}
                    </div>

                    {/* Explanation panel */}
                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <div className={styles.panelIcon}>
                                <ZapIcon size={20} fill="var(--primary)" />
                            </div>
                            <div className={styles.panelHeaderText}>
                                <h3>AI Tutor</h3>
                                <p>Ask for help at any point in the video</p>
                            </div>
                        </div>

                        <div className={styles.panelBody}>
                            {explaining ? (
                                <div className={styles.loadingDots}>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            ) : explanation ? (
                                <div className={styles.explanation}>
                                    <div className={styles.explanationText}>
                                        {explanation.explanation}
                                    </div>
                                    {explanation.transcript_excerpt && (
                                        <div className={styles.transcriptExcerpt}>
                                            <span className={styles.transcriptLabel}>From the video</span>
                                            {explanation.transcript_excerpt}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyStateIcon}>
                                        <LightbulbIcon size={28} />
                                    </div>
                                    <h4>Need help understanding?</h4>
                                    <p>
                                        Click "I don't understand this part" while watching the video.
                                        The AI tutor will pause the video and explain what's happening
                                        at that moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
