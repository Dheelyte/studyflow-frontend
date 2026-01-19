"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import PlaylistSkeleton from '@/components/PlaylistSkeleton';
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { PlayIcon, ClockIcon, ChevronDown, ChevronUp, ZapIcon, ShareIcon, MenuIcon, CheckCircleIcon, BookOpenIcon, VideoIcon, TrophyIconSimple } from "@/components/Icons";
import ShareModal from "@/components/ShareModal";
import QuizModal from "@/components/QuizModal";

// Helper to normalize API response to existing component state structure
const normalizePlaylistData = (apiData) => {
    if (!apiData) return null;

    let totalResources = 0;
    let completedResources = 0;

    // Global flag to track if we have found the first incomplete item (Next Up)
    let foundNextUp = false;

    // Track if global sequence is broken (used to lock future items)
    // Actually `foundNextUp` serves this purpose: if foundNextUp is true, everything subsequent is locked.

    const modules = (apiData.modules || []).map(m => {
        let moduleResourcesTotal = 0;
        let moduleResourcesCompleted = 0;

        const lessons = (m.lessons || []).map(l => ({
            lesson_title: l.title,
            estimated_time: l.estimated_time || "1 hour",
            resources: (l.resources || []).map(r => {
                totalResources++;
                moduleResourcesTotal++;

                if (r.is_completed) {
                    completedResources++;
                    moduleResourcesCompleted++;
                }

                let isNextUp = false;
                let isLocked = false;

                if (!r.is_completed) {
                    if (!foundNextUp) {
                        isNextUp = true;
                        foundNextUp = true;
                    } else {
                        isLocked = true;
                    }
                }

                return {
                    resource_id: r.id,
                    label: r.title,
                    type: r.type,
                    description: r.description,
                    resource_url: r.url,
                    is_completed: r.is_completed,
                    isNextUp: isNextUp,
                    isLocked: isLocked
                };
            })
        }));

        const isResourcesComplete = moduleResourcesTotal > 0 && moduleResourcesTotal === moduleResourcesCompleted;
        const isQuizCompleted = m.quiz_completed === true;

        let isQuizNextUp = false;
        let isQuizLocked = false;

        // Quiz Logic
        // 1. If resources NOT complete, Quiz is locked.
        // 2. If resources complete, check if Quiz is complete.
        // 3. If Quiz NOT complete:
        //    - If !foundNextUp (meaning this is the first incomplete thing after resources), THIS IS NEXT UP.
        //    - Else (foundNextUp implies a resource earlier in this module was incomplete), Quiz is locked.

        if (!isResourcesComplete) {
            isQuizLocked = true;
            // The foundNextUp would have been triggered by a resource inside this module already.
        } else {
            // Resources are done. Check Quiz status.
            if (!isQuizCompleted) {
                if (!foundNextUp) {
                    isQuizNextUp = true;
                    foundNextUp = true;
                } else {
                    // This creates a lock if some previous module had an incomplete item
                    isQuizLocked = true;
                }
            }
        }

        // Note: completionPercentage calculation counts resources only. 
        // We might want to include quizzes in "Module Completion" logic but maybe not the global % yet unless requested.
        // For 'is_module_completed' flag, usually it means everything in it is done.
        const isModuleComplete = isResourcesComplete && isQuizCompleted;

        return {
            module_id: m.id,
            module_title: m.title,
            lessons: lessons,
            is_module_completed: isModuleComplete,
            isQuizLocked,
            isQuizNextUp,
            quiz_completed: isQuizCompleted
        };
    });

    const completionPercentage = totalResources > 0
        ? Math.round((completedResources / totalResources) * 100)
        : 0;

    return {
        _raw: apiData,
        curriculum_title: apiData.title,
        overview: apiData.description || "No description available.",
        modules: modules,
        learning_objectives: apiData.objectives || [],
        completionPercentage,
        isStarted: completedResources > 0,
        nextUpId: foundNextUp ? "next-up-resource" : null, // This ID might conflict if multiple "next ups", but logic ensures only 1 true
        level: apiData.level || "Beginner"
    };
};

export default function PlaylistClient({ params }) {
    // Unwrap params for Next.js 15+ where params is a Promise
    const resolvedParams = React.use(params);
    const playlistId = resolvedParams?.id;
    const searchParams = useSearchParams();

    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});

    // Derived state for UI, usually would be in the data object or separate
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    const [showShareModal, setShowShareModal] = useState(false);
    const [highlightResource, setHighlightResource] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [activeQuizModule, setActiveQuizModule] = useState(null);

    // Ref to track if we have already fetched
    const fetchedRef = useRef(null);

    useEffect(() => {
        const fetchCurriculum = async () => {
            const topic = searchParams.get("topic");

            // Key to identify if we are fetching the same thing
            const fetchKey = playlistId ? `id-${playlistId}` : (topic ? `topic-${topic}` : null);

            if (!fetchKey) {
                setLoading(false);
                return;
            }

            if (fetchedRef.current === fetchKey) return;
            fetchedRef.current = fetchKey;

            try {
                setLoading(true);
                let data = null;

                if (playlistId) {
                    // console.log("Fetching by ID:", playlistId);
                    const response = await curriculum.get(playlistId);
                    // Normalize the response
                    data = normalizePlaylistData(response);

                    // Set derived state from normalized data
                    if (data) {
                        setCompletionPercentage(data.completionPercentage);
                        if (data.isStarted) setIsStarted(true);
                    }

                } else if (topic) {
                    // Existing topic-based generation...
                    const genParams = {
                        topic,
                        experience_level: searchParams.get("experience_level") || "Beginner",
                        duration: searchParams.get("duration") || "4 weeks"
                    };
                    // console.log("Generating curriculum:", genParams);
                    const response = await curriculum.generate(genParams);
                    // The generator API returns a structure closer to our internal state, usually.
                    // But if we want consistency, we might assume generate returns the OLD format 
                    // which is what 'data' was assigned to directly before.
                    // Let's assume generate returns the structure we were already using.
                    data = response;
                }

                if (!data || !data.modules) {
                    throw new Error("Invalid playlist data received");
                }

                setCurriculumData(data);

                // Auto-expand module containing "Next Up" or first module
                if (data.modules && data.modules.length > 0) {
                    let moduleToExpand = data.modules[0].module_id !== undefined ? data.modules[0].module_id : 0;

                    // Find module with Next Up resource or Quiz
                    for (const m of data.modules) {
                        let innerFound = false;
                        if (m.lessons) {
                            for (const l of m.lessons) {
                                if (l.resources && l.resources.some(r => r.isNextUp)) {
                                    moduleToExpand = m.module_id;
                                    innerFound = true;
                                    break;
                                }
                            }
                        }
                        if (innerFound || m.isQuizNextUp) {
                            moduleToExpand = m.module_id;
                            break;
                        }
                    }

                    setExpandedModules({ [moduleToExpand]: true });

                    // Scroll to Next Up resource after a brief delay to allow rendering
                    setTimeout(() => {
                        const nextUp = document.getElementById("next-up-resource");
                        const target = nextUp;

                        if (target) {
                            target.scrollIntoView({ behavior: "smooth", block: "center" });

                            // Only highlight if the user has already started (resuming)
                            // This prevents the "glow" effect on a brand new playlist where the first item is naturally next
                            if (data.isStarted) {
                                setHighlightResource(true);
                                setTimeout(() => setHighlightResource(false), 2000);
                            }
                        }
                    }, 600);
                }

            } catch (err) {
                console.error("Failed to fetch curriculum:", err);
                setError(err.message || "Failed to load curriculum");
                fetchedRef.current = null;
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, [playlistId, searchParams]);

    const toggleModule = (id) => {
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePlay = () => {
        if (!isStarted) {
            setIsStarted(true);
        }

        // Scroll to Next Up or First Resource
        setTimeout(() => {
            const nextUpResource = document.getElementById("next-up-resource");
            const firstResource = document.getElementById("first-resource");
            const target = nextUpResource || firstResource;

            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
                setHighlightResource(true);
                setTimeout(() => setHighlightResource(false), 4500);
            }
        }, 100);
    };

    // Updated handler with redundancy check
    const handleResourceClick = async (resourceId, url, isCompleted, isLocked, e) => {
        // e.preventDefault(); // Optional: decide if we want to block navigation until complete. Usually unsafe for UX.

        if (isLocked) {
            // Allow navigation but do not track progress
            return;
        }

        // Check if already completed to avoid redundant calls
        if (isCompleted) {
            // console.log("Resource already completed, skipping API call:", resourceId);
            return;
        }

        try {
            // console.log("Marking resource complete:", resourceId);
            const response = await curriculum.completeResource(resourceId);

            if (response && response.is_completed) {
                // Update local state without full refetch
                setCurriculumData(prev => {
                    if (!prev || !prev._raw) return prev;

                    // Create deep clone of raw data to mutate
                    const newRaw = JSON.parse(JSON.stringify(prev._raw));

                    // Find the resource in raw data
                    let found = false;
                    for (const m of newRaw.modules || []) {
                        for (const l of m.lessons || []) {
                            for (const r of l.resources || []) {
                                if (r.id === resourceId) {
                                    r.is_completed = true;
                                    found = true;
                                    break;
                                }
                            }
                            if (found) break;
                        }
                        if (found) break;
                    }

                    if (found) {
                        return normalizePlaylistData(newRaw);
                    }
                    return prev;
                });
            }

        } catch (err) {
            console.error("Failed to mark resource complete:", err);
            // Non-blocking error
        }

        // Ensure first module is expanded
        setExpandedModules(prev => ({ ...prev, 1: true }));


    };

    // Sync completion percentage when data changes
    useEffect(() => {
        if (curriculumData) {
            setCompletionPercentage(curriculumData.completionPercentage);
        }
    }, [curriculumData]);


    const handleOpenQuiz = (moduleId, moduleTitle) => {
        setActiveQuizModule({ id: moduleId, title: moduleTitle });
        setShowQuizModal(true);
    };

    const handleQuizComplete = (score) => {
        setShowQuizModal(false);
        setActiveQuizModule(null);
        // Force re-fetch logic or local update. 
        // Since quiz_completed is server-side, it's safest to trigger a refresh 
        // OR update local state optimistically.
        // Let's update local state optimistically to unblock the next module immediately.
        setCurriculumData(prev => {
            if (!prev) return prev;

            // We need to simulate the raw data update so 'normalizePlaylistData' can re-run properly
            // Because locking logic is inside normalizePlaylistData.
            const newRaw = JSON.parse(JSON.stringify(prev._raw));
            const modIndex = newRaw.modules.findIndex(m => m.id === activeQuizModule.id);
            if (modIndex !== -1) {
                newRaw.modules[modIndex].quiz_completed = true;
            }
            return normalizePlaylistData(newRaw);
        });
    };

    if (loading) {
        return <PlaylistSkeleton />;
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
                    <span className={styles.type}>{(curriculumData.level || "Beginner").toUpperCase()}</span>
                    <h1 className={styles.title}>{curriculumData.curriculum_title}</h1>
                    <p className={styles.description}>
                        {isDescriptionExpanded ? curriculumData.overview : (curriculumData.overview?.slice(0, 200) + (curriculumData.overview?.length > 200 ? "..." : ""))}
                        {curriculumData.overview?.length > 200 && (
                            <button
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                className={styles.showMoreButton}
                            >
                                {isDescriptionExpanded ? "Show less" : "Show more"}
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <div className={styles.controls}>
                <button className={styles.playButton} onClick={handlePlay}>
                    <PlayIcon size={24} fill="white" />
                    {isStarted ? "Continue Learning" : "Start Learning"}
                </button>

                <button className={styles.iconButton} title="Share Playlist" onClick={() => setShowShareModal(true)}>
                    <ShareIcon />
                </button>
            </div>

            {showShareModal && (
                <ShareModal
                    onClose={() => setShowShareModal(false)}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={curriculumData.curriculum_title || 'Check out this playlist!'}
                />
            )}

            {showQuizModal && activeQuizModule && (
                <QuizModal
                    isOpen={showQuizModal}
                    onClose={() => setShowQuizModal(false)}
                    moduleTitle={activeQuizModule.title}
                    moduleId={activeQuizModule.id}
                    onComplete={handleQuizComplete}
                    curriculumTitle={curriculumData.curriculum_title}
                    experienceLevel={curriculumData.level}
                />
            )}

            {/* Progress Bar only shown if started */}
            {isStarted && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                        {/* Display real completion percentage */}
                        <span>Playlist Progress</span>
                        <span>{completionPercentage}% completed</span>
                    </div>
                    <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
            )}

            <div className={styles.content}>

                {/* Learning Objectives Section - Filter out nulls/empty */}
                {curriculumData.learning_objectives && curriculumData.learning_objectives.length > 0 && (
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
                        const uniqueId = module.module_id !== undefined ? module.module_id : mIdx;

                        return (
                            <div key={uniqueId} className={styles.module}>
                                {/* Apply conditional class for completed module header */}
                                <div
                                    className={`${styles.moduleHeader} ${module.is_module_completed ? styles.completedModuleHeader : ''}`}
                                    onClick={() => toggleModule(uniqueId)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className={styles.moduleTitle}>{module.module_title}</span>
                                        {module.is_module_completed && <CheckCircleIcon size={20} fill="#10b981" />}
                                    </div>
                                    {expandedModules[uniqueId] ? <ChevronUp /> : <ChevronDown />}
                                </div>

                                {expandedModules[uniqueId] && (
                                    <div className={styles.moduleContent}>
                                        {module.lessons && module.lessons.map((lesson, lessonIdx) => (
                                            <div key={lessonIdx} className={styles.lesson}>
                                                <div className={styles.lessonHeader}>
                                                    <h3 className={styles.lessonTitle}>{lesson.lesson_title}</h3>
                                                    <span className={styles.lessonDuration}>
                                                        {lesson.estimated_time && <><ClockIcon size={14} /> {lesson.estimated_time}</>}
                                                    </span>
                                                </div>

                                                <div className={styles.resourcesList}>
                                                    {lesson.resources && lesson.resources.map((resource, rIdx) => {
                                                        const firstId = curriculumData.modules[0]?.module_id !== undefined ? curriculumData.modules[0].module_id : 0;
                                                        const isFirstResource = uniqueId === firstId && lessonIdx === 0 && rIdx === 0;

                                                        // ID for scrolling
                                                        let elementId = null;
                                                        if (resource.isNextUp) elementId = "next-up-resource";
                                                        else if (isFirstResource) elementId = "first-resource";

                                                        return (
                                                            <a
                                                                href={resource.resource_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                key={rIdx}
                                                                id={elementId}
                                                                // Apply conditional class for completed resources
                                                                className={`
                                                                    ${styles.resourceCard} 
                                                                    ${resource.is_completed ? styles.completedResource : ''}
                                                                    ${isFirstResource && highlightResource ? styles.highlight : ""} 
                                                                    ${resource.isNextUp ? styles.nextUpResource : ""} 
                                                                    ${resource.isNextUp && highlightResource ? styles.highlight : ""}
                                                                `}
                                                                // UPDATED: Pass is_completed to handler
                                                                onClick={(e) => handleResourceClick(resource.resource_id, resource.resource_url, resource.is_completed, resource.isLocked, e)}
                                                                style={{
                                                                    opacity: resource.isLocked ? 0.6 : 1,
                                                                }}
                                                            >
                                                                {resource.isNextUp && <div className={styles.nextUpBadge}>Next Up</div>}

                                                                <div className={`${styles.resourceIcon} ${styles.mediaIcon}`}>
                                                                    {resource.type === "Video" ? <VideoIcon size={20} /> : <BookOpenIcon size={20} />}
                                                                </div>
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
                                                            </a>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ marginTop: '1.5rem' }}>
                                            <button
                                                id={module.isQuizNextUp ? "next-up-resource" : null}
                                                className={`${styles.resourceCard} ${module.isQuizNextUp ? styles.highlight : ''}`}
                                                disabled={module.isQuizLocked}
                                                style={{
                                                    width: '100%',
                                                    background: module.quiz_completed
                                                        ? 'rgba(16, 185, 129, 0.1)' // Greenish tint if done
                                                        : 'linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05))',
                                                    border: module.quiz_completed
                                                        ? '1px solid rgba(16, 185, 129, 0.2)'
                                                        : '1px solid rgba(255,215,0,0.3)',
                                                    justifyContent: 'flex-start',
                                                    gap: '12px',
                                                    cursor: module.isQuizLocked ? 'not-allowed' : 'pointer',
                                                    textAlign: 'left',
                                                    padding: '16px',
                                                    opacity: module.isQuizLocked ? 0.5 : 1,
                                                    position: 'relative'
                                                }} onClick={() => !module.isQuizLocked && !module.quiz_completed && handleOpenQuiz(module.module_id, module.module_title)}>

                                                {module.isQuizNextUp && <div className={styles.nextUpBadge}>Next Up</div>}

                                                <div className={styles.resourceIcon} style={{
                                                    background: module.quiz_completed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,215,0,0.2)',
                                                    color: module.quiz_completed ? '#10b981' : '#ffd700'
                                                }}>
                                                    {module.quiz_completed ? <CheckCircleIcon size={20} /> : <TrophyIconSimple size={20} />}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                    <span style={{ fontWeight: '700', color: 'var(--foreground)' }}>
                                                        {module.quiz_completed ? "Quiz Completed" : (module.isQuizLocked ? "Quiz Locked" : "Ready to test your knowledge?")}
                                                    </span>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--secondary)' }}>
                                                        {module.quiz_completed
                                                            ? `You've passed the ${module.module_title} quiz!`
                                                            : (module.isQuizLocked ? "Complete all previous items to unlock." : `Take the ${module.module_title} Quiz`)}
                                                    </span>
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

        </div>
    );
}
