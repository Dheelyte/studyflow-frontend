"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import GenerationOverlay from '@/components/GenerationOverlay';
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRedirectState } from "@/hooks/useRedirectState";
import ShareModal from "@/components/ShareModal";
import { PlayIcon, ClockIcon, ChevronDown, ChevronUp, ZapIcon, HeartIcon, ShareIcon, MenuIcon, CheckCircleIcon, BookOpenIcon, VideoIcon, TrophyIconSimple } from "@/components/Icons";

export default function CurriculumClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();
    const { saveState, restoreState } = useRedirectState();

    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});
    // isStarted state: initially false (hides progress bar, shows "Start Learning")
    const [isStarted, setIsStarted] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Mock state for liking
    const [isLiked, setIsLiked] = useState(false);
    const [highlightResource, setHighlightResource] = useState(false);

    // New Interaction State
    const [isGlowing, setIsGlowing] = useState(false);
    const startBtnRef = useRef(null);

    const handleResourceClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (startBtnRef.current) {
            startBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setIsGlowing(true);
            setTimeout(() => setIsGlowing(false), 2000); // Remove glow after 2s
        }
    };

    // Ref to track if we have already fetched for the current topic to prevent double-fetch in StrictMode
    const fetchedTopicRef = useRef(null);

    useEffect(() => {
        const fetchCurriculum = async () => {
            const topic = searchParams.get("topic");

            // Check for restored state first
            // We strip the topic check initially because if we have state, we might not need to strictly validate topic params against current URL if we trust the state,
            // but it's safer to still check topic or matches. 
            // However, the restoreState clears the state, so it's a one-time check.
            const restoredState = restoreState('curriculum_data');
            if (restoredState && restoredState.data) {
                console.log("Restoring curriculum from state");
                setCurriculumData(restoredState.data);

                // Expand first module by default if available (same logic as below)
                if (restoredState.data.modules && restoredState.data.modules.length > 0) {
                    const firstId = restoredState.data.modules[0].module_id !== undefined ? restoredState.data.modules[0].module_id : 0;
                    setExpandedModules({ [firstId]: true });
                }

                // IMPORTANT: Update the ref so subsequent renders (e.g. Strict Mode) don't try to fetch again
                if (topic) {
                    fetchedTopicRef.current = topic;
                }

                setLoading(false);
                return;
            }

            if (!topic) {
                // If no topic is provided, stop loading. 
                setLoading(false);
                return;
            }

            // Prevent double fetch if we already fetched this topic
            if (fetchedTopicRef.current === topic) {
                return;
            }
            fetchedTopicRef.current = topic;

            try {
                setLoading(true);
                const params = {
                    topic,
                    experience_level: searchParams.get("experience_level") || "Beginner",
                    duration: searchParams.get("duration") || "4 weeks"
                };

                console.log("Fetching curriculum with params:", params);
                const data = await curriculum.generate(params);
                console.log("Curriculum Response Data:", data);

                if (!data || !data.modules) {
                    throw new Error("Invalid curriculum data format received");
                }

                setCurriculumData(data);

                // Expand first module by default if available
                if (data.modules && data.modules.length > 0) {
                    // Use module_id if present, otherwise use index 0
                    const firstId = data.modules[0].module_id !== undefined ? data.modules[0].module_id : 0;
                    setExpandedModules({ [firstId]: true });
                }
            } catch (err) {
                console.error("Failed to fetch curriculum:", err);
                setError(err.message || "Failed to load curriculum");
                // Reset ref on error to allow retry
                fetchedTopicRef.current = null;
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, [searchParams, restoreState]);

    const toggleModule = (id) => {
        console.log("Toggling module:", id);
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePlay = async () => {
        if (!user) {
            saveState('curriculum_data', curriculumData);
            const redirectUrl = encodeURIComponent(`${pathname}?${searchParams.toString()}`);
            router.push(`/login?redirect=${redirectUrl}`);
            return;
        }

        // If already started, just scroll (or if we want to support "Continue Learning" not creating new playlist every time? 
        // User request implies creating it. Let's assume correct behavior is to create if not already tracking?)
        // Actually, if we are purely "Starting", we create. If "Continuing" (isStarted=true) we might just scroll?
        // But the user prompt says: "When a logged in clicks 'Continue Learning', send ... to create a playlist".
        // This suggests we might even do it on Continue? But that would duplicate playlists.
        // Let's assume we do it once. But for now, let's implement the creation logic.

        try {
            setIsCreating(true);
            const payload = {
                title: curriculumData.curriculum_title,
                level: searchParams.get("experience_level") || "Beginner",
                timeline: searchParams.get("duration") || "4 weeks",
                description: curriculumData.overview,
                objectives: curriculumData.learning_objectives || [],
                content: curriculumData
            };

            console.log("Creating playlist with payload", payload);
            const response = await curriculum.createPlaylist(payload);

            if (response && response.id) {
                // Redirect to the new playlist page
                router.push(`/playlist/${response.id}`);
            } else {
                console.error("Created playlist but got no ID", response);
                // Fallback behavior if API fails or returns unexpected?
                // For now, let's just do the old behavior if it fails to redirect?
                // Or maybe alert?
                alert("Failed to create playlist. Checking console.");
            }

        } catch (e) {
            console.error("Failed to create playlist", e);
            alert("Failed to save playlist. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    // Calculate Completion (Mock logic)
    const completionPercentage = 0; // Example value

    if (showOverlay) {
        return (
            <GenerationOverlay
                topic={searchParams.get("topic")}
                experience={searchParams.get("experience_level")}
                isFinished={!loading}
                onComplete={() => setShowOverlay(false)}
            />
        );
    }

    if (error) {
        return (
            <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                <div style={{ color: 'var(--text-error)', textAlign: 'center' }}>
                    <h2>Error</h2>
                    <p>An error occurred, please try again</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{
                        padding: '12px 24px',
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '24px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!curriculumData) {
        return (
            <div className={styles.container} style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: "var(--text-primary)", textAlign: "center" }}>
                    <h2>No curriculum found</h2>
                    <p>Try searching for a topic on the home page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.headerBg}></div>
            <div className={styles.header}>
                <div className={styles.playlistImage}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", textAlign: "center", lineHeight: "1.2", padding: "16px" }}>
                        {curriculumData.curriculum_title}
                    </span>
                </div>
                <div className={styles.playlistInfo}>
                    <span className={styles.type}>{(searchParams.get("experience_level") || "Beginner").toUpperCase()}</span>
                    <h1 className={styles.title}>{curriculumData.curriculum_title}</h1>
                    <p className={styles.description}>{curriculumData.overview}</p>
                </div>
            </div>

            <div className={styles.controls}>
                <button ref={startBtnRef} className={`${styles.playButton} ${isGlowing ? styles.glowing : ""}`} onClick={handlePlay} disabled={isCreating}>
                    <PlayIcon size={24} fill="white" />
                    {isCreating ? "Creating Playlist..." : (isStarted ? "Continue Learning" : "Start Learning")}
                </button>

                <button className={styles.iconButton} title="Share Playlist" onClick={() => setIsShareModalOpen(true)}>
                    <ShareIcon />
                </button>
            </div>

            {/* Progress Bar only shown if started */}
            {isStarted && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                        {/* ... existing progress UI kept simple for now */}
                        <span>Playlist Progress</span>
                        <span>{completionPercentage}% completed</span>
                    </div>
                    <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
            )}

            <div className={styles.content}>

                {/* Learning Objectives Section */}
                {curriculumData.learning_objectives && (
                    <div className={styles.objectivesSection}>
                        <h2 className={styles.sectionTitle}>What You'll Learn</h2>
                        <ul className={styles.objectivesList}>
                            {curriculumData.learning_objectives.map((objective, idx) => (
                                <li key={idx} className={styles.objectiveItem}>
                                    <div className={styles.checkIcon}><CheckCircleIcon size={20} /></div>
                                    <span>{objective}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.modulesContainer}>
                    <h2 className={styles.sectionTitle}>Curriculum Content</h2>
                    {curriculumData.modules && curriculumData.modules.map((module, mIdx) => {
                        // Robust ID handling: prefer module_id, fallback to index
                        const uniqueId = module.module_id !== undefined ? module.module_id : mIdx;

                        return (
                            <div key={uniqueId} className={styles.module}>
                                <div className={styles.moduleHeader} onClick={() => toggleModule(uniqueId)}>
                                    <span className={styles.moduleTitle}>{module.module_title}</span>
                                    {expandedModules[uniqueId] ? <ChevronUp /> : <ChevronDown />}
                                </div>

                                {expandedModules[uniqueId] && (
                                    <div className={styles.moduleContent}>
                                        {module.lessons && module.lessons.map((lesson, lessonIdx) => (
                                            <div key={lessonIdx} className={styles.lesson}>
                                                <div className={styles.lessonHeader}>
                                                    <h3 className={styles.lessonTitle}>{lesson.lesson_title}</h3>
                                                    <span className={styles.lessonDuration}>
                                                        <ClockIcon size={14} /> {lesson.estimated_time}
                                                    </span>
                                                </div>

                                                <div className={styles.resourcesList}>
                                                    {lesson.resources && lesson.resources.map((resource, rIdx) => {
                                                        const firstId = curriculumData.modules[0]?.module_id !== undefined ? curriculumData.modules[0].module_id : 0;

                                                        return (
                                                            <div
                                                                key={rIdx}
                                                                className={`${styles.resourceCard} ${styles.resourceDisabled}`}
                                                                onClick={(e) => handleResourceClick(e)}
                                                                title="Click 'Start Learning' to create your playlist first"
                                                            >
                                                                <div className={styles.resourceInfo}>
                                                                    <div className={styles.resourceHeaderRow}>
                                                                        <div className={styles.resourceTitleGroup}>
                                                                            <span className={styles.resourceLabel}>{resource.label}</span>
                                                                        </div>
                                                                    </div>
                                                                    <p className={styles.resourceDescription}>{resource.description}</p>
                                                                </div>
                                                                <div className={styles.badgeContainer}>
                                                                    <span className={styles.xpBadge}>+11 XP</span>
                                                                    <span className={styles.resourceTypeBadge}>
                                                                        {resource.type === "Video" ? <VideoIcon size={12} /> : <BookOpenIcon size={12} />}
                                                                        {resource.type}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                        <div style={{ marginTop: '1.5rem' }}>
                                            <button className={styles.resourceCard} style={{
                                                width: '100%',
                                                background: 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))',
                                                border: '1px solid rgba(255,215,0,0.3)',
                                                justifyContent: 'flex-start',
                                                gap: '12px',
                                                cursor: 'pointer', textAlign: 'left', padding: '16px'
                                            }} onClick={() => alert("Quiz feature coming soon!")}>
                                                <div className={styles.resourceIcon} style={{ background: 'rgba(255,215,0,0.2)', color: '#ffd700' }}>
                                                    <TrophyIconSimple size={20} />
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--foreground)' }}>Ready to test your knowledge?</span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>Take the {module.module_title} Quiz</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {isShareModalOpen && (
                <ShareModal
                    onClose={() => setIsShareModalOpen(false)}
                    url={typeof window !== "undefined" ? `${window.location.origin}${pathname}?${searchParams.toString()}` : ""}
                    title={curriculumData.curriculum_title}
                    heading="Share this curriculum"
                />
            )}
        </div>
    );
}
