"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { PlayIcon, ClockIcon, ChevronDown, ChevronUp, ZapIcon, HeartIcon, ShareIcon, MenuIcon, CheckCircleIcon, BookOpenIcon, VideoIcon } from "@/components/Icons";

export default function PlaylistPage({ params }) {
    const searchParams = useSearchParams();

    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    // isStarted state: initially false (hides progress bar, shows "Start Learning")
    const [isStarted, setIsStarted] = useState(false);

    // Mock state for liking
    const [isLiked, setIsLiked] = useState(false);
    const [highlightResource, setHighlightResource] = useState(false);

    // Ref to track if we have already fetched for the current topic to prevent double-fetch in StrictMode
    const fetchedTopicRef = useRef(null);

    useEffect(() => {
        const fetchCurriculum = async () => {
            const topic = searchParams.get("topic");

            if (!topic) {
                // If no topic is provided, stop loading. 
                // in a real app check for params.id to load saved playlist
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
    }, [searchParams]);

    const toggleModule = (id) => {
        console.log("Toggling module:", id);
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePlay = () => {
        if (!isStarted) {
            setIsStarted(true);
        }

        // Ensure first module is expanded
        if (curriculumData && curriculumData.modules && curriculumData.modules.length > 0) {
            const firstId = curriculumData.modules[0].module_id !== undefined ? curriculumData.modules[0].module_id : 0;
            setExpandedModules(prev => ({ ...prev, [firstId]: true }));
        }

        // Scroll and highlight
        setTimeout(() => {
            const firstResource = document.getElementById("first-resource");
            if (firstResource) {
                firstResource.scrollIntoView({ behavior: "smooth", block: "center" });
                setHighlightResource(true);
                setTimeout(() => setHighlightResource(false), 4500); // Remove highlight after user has definitely seen it
            }
        }, 100);
    };

    // Calculate Completion (Mock logic)
    const completionPercentage = 0; // Example value

    if (loading) {
        return (
            <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
                    <div className={styles.loadingSpinner}></div> {/* Assuming global spinner or just text */}
                    <h2>Generating your personalized curriculum...</h2>
                    <p>This may take a few seconds.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-error)', textAlign: 'center' }}>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', cursor: 'pointer' }}>Try Again</button>
                </div>
            </div>
        );
    }

    if (!curriculumData) {
        return (
            <div className={styles.container} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: 'var(--text-primary)', textAlign: 'center' }}>
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
                    <ZapIcon size={64} fill="white" />
                </div>
                <div className={styles.playlistInfo}>
                    <span className={styles.type}>Curriculum</span>
                    <h1 className={styles.title}>{curriculumData.curriculum_title}</h1>
                    <p className={styles.description}>{curriculumData.overview}</p>
                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <span>By <strong>StudyFlow AI</strong></span>
                        </div>
                        <div className={styles.metaItem}>
                            <span>•</span>
                            <span>Last updated today</span>
                        </div>
                        <div className={styles.metaItem}>
                            <span>•</span>
                            <span>{curriculumData.modules ? curriculumData.modules.length : 0} modules</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.controls}>
                <button className={styles.playButton} onClick={handlePlay}>
                    <PlayIcon size={24} fill="white" />
                    {isStarted ? "Continue Learning" : "Start Learning"}
                </button>

                <button
                    className={styles.iconButton}
                    onClick={() => setIsLiked(!isLiked)}
                    title={isLiked ? "Remove from Library" : "Save to Library"}
                    style={{ color: isLiked ? "var(--primary)" : "inherit" }}
                >
                    <HeartIcon fill={isLiked ? "currentColor" : "none"} />
                </button>

                <button className={styles.iconButton} title="Share Playlist">
                    <ShareIcon />
                </button>

                {/* 
                  Removed More Options button as requested
                */}
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

                                                {/* Removed Topics List as requested */}

                                                <div className={styles.resourcesList}>
                                                    {lesson.resources && lesson.resources.map((resource, rIdx) => {
                                                        const firstId = curriculumData.modules[0]?.module_id !== undefined ? curriculumData.modules[0].module_id : 0;
                                                        const isFirstResource = uniqueId === firstId && lessonIdx === 0 && rIdx === 0;

                                                        return (
                                                            <a
                                                                href={resource.resource_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                key={rIdx}
                                                                id={isFirstResource ? "first-resource" : null}
                                                                className={`${styles.resourceCard} ${isFirstResource && highlightResource ? styles.highlight : ""}`}
                                                            >
                                                                <div className={styles.resourceIcon}>
                                                                    {resource.type === "Video" ? <VideoIcon size={20} /> : <BookOpenIcon size={20} />}
                                                                </div>
                                                                <div className={styles.resourceInfo}>
                                                                    <div className={styles.resourceHeaderRow}>
                                                                        <span className={styles.resourceLabel}>{resource.label}</span>
                                                                        <span className={styles.resourceTypeBadge}>{resource.type}</span>
                                                                    </div>
                                                                    <p className={styles.resourceDescription}>{resource.description}</p>
                                                                </div>
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
