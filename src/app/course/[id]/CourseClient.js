"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CourseSkeleton from '@/components/CourseSkeleton';
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { PlayIcon, ClockIcon, ChevronDown, ChevronUp, ZapIcon, ShareIcon, CheckCircleIcon, VideoIcon, TrophyIconSimple } from "@/components/Icons";
import ShareModal from "@/components/ShareModal";
import QuizModal from "@/components/QuizModal";

// Helper to normalize API response to component state structure
const normalizeCourseData = (apiData) => {
    if (!apiData) return null;

    let totalTopics = 0;
    let completedTopics = 0;
    let foundNextUp = false;

    const modules = (apiData.modules || []).map(m => {
        let moduleTopicsTotal = 0;
        let moduleTopicsCompleted = 0;

        const lessons = (m.lessons || []).map(l => ({
            lesson_title: l.title,
            estimated_time: l.estimated_time || "1 hour",
            topics: (l.topics || []).map(t => {
                totalTopics++;
                moduleTopicsTotal++;

                if (t.is_completed) {
                    completedTopics++;
                    moduleTopicsCompleted++;
                }

                let isNextUp = false;
                let isLocked = false;

                if (!t.is_completed) {
                    if (!foundNextUp) {
                        isNextUp = true;
                        foundNextUp = true;
                    } else {
                        isLocked = true;
                    }
                }

                return {
                    topic_id: t.id,
                    title: t.title,
                    description: t.description,
                    youtube_video_id: t.youtube_video_id,
                    is_completed: t.is_completed,
                    isNextUp: isNextUp,
                    isLocked: isLocked
                };
            })
        }));

        const isTopicsComplete = moduleTopicsTotal > 0 && moduleTopicsTotal === moduleTopicsCompleted;
        const isQuizCompleted = m.quiz_completed === true;

        let isQuizNextUp = false;
        let isQuizLocked = false;

        if (!isTopicsComplete) {
            isQuizLocked = true;
        } else {
            if (!isQuizCompleted) {
                if (!foundNextUp) {
                    isQuizNextUp = true;
                    foundNextUp = true;
                } else {
                    isQuizLocked = true;
                }
            }
        }

        const isModuleComplete = isTopicsComplete && isQuizCompleted;

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

    const completionPercentage = totalTopics > 0
        ? Math.round((completedTopics / totalTopics) * 100)
        : 0;

    return {
        _raw: apiData,
        curriculum_title: apiData.title,
        overview: apiData.description || "No description available.",
        modules: modules,
        learning_objectives: apiData.objectives || [],
        completionPercentage,
        isStarted: completedTopics > 0,
    };
};

export default function CourseClient({ params }) {
    const resolvedParams = React.use(params);
    const courseId = resolvedParams?.id;
    const router = useRouter();

    const [curriculumData, setCurriculumData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedModules, setExpandedModules] = useState({});
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isStarted, setIsStarted] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [highlightResource, setHighlightResource] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [activeQuizModule, setActiveQuizModule] = useState(null);

    const fetchedRef = useRef(null);

    useEffect(() => {
        const fetchCourse = async () => {
            const fetchKey = courseId ? `id-${courseId}` : null;

            if (!fetchKey) {
                setLoading(false);
                return;
            }

            if (fetchedRef.current === fetchKey) return;
            fetchedRef.current = fetchKey;

            try {
                setLoading(true);
                const response = await curriculum.getCourse(courseId);
                const data = normalizeCourseData(response);

                if (!data || !data.modules) {
                    throw new Error("Invalid course data received");
                }

                setCurriculumData(data);
                document.title = `${data.curriculum_title} | Primerly`;

                if (data.completionPercentage !== undefined) {
                    setCompletionPercentage(data.completionPercentage);
                }
                if (data.isStarted) setIsStarted(true);

                // Auto-expand module containing "Next Up" or first module
                if (data.modules && data.modules.length > 0) {
                    let moduleToExpand = data.modules[0].module_id !== undefined ? data.modules[0].module_id : 0;

                    for (const m of data.modules) {
                        let innerFound = false;
                        if (m.lessons) {
                            for (const l of m.lessons) {
                                if (l.topics && l.topics.some(t => t.isNextUp)) {
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

                    setTimeout(() => {
                        const nextUp = document.getElementById("next-up-topic");
                        if (nextUp) {
                            nextUp.scrollIntoView({ behavior: "smooth", block: "center" });
                            if (data.isStarted) {
                                setHighlightResource(true);
                                setTimeout(() => setHighlightResource(false), 2000);
                            }
                        }
                    }, 600);
                }
            } catch (err) {
                console.error("Failed to fetch course:", err);
                setError(err.message || "Failed to load course");
                fetchedRef.current = null;
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const toggleModule = (id) => {
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePlay = () => {
        if (!isStarted) {
            setIsStarted(true);
        }

        setTimeout(() => {
            const nextUpTopic = document.getElementById("next-up-topic");
            const firstTopic = document.getElementById("first-topic");
            const target = nextUpTopic || firstTopic;

            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" });
                setHighlightResource(true);
                setTimeout(() => setHighlightResource(false), 4500);
            }
        }, 100);
    };

    const handleTopicClick = async (topicId, isCompleted, isLocked) => {
        if (isLocked) return;

        // Mark as completed if not already
        if (!isCompleted) {
            try {
                await curriculum.completeTopic(topicId);
                // Update local state
                setCurriculumData(prev => {
                    if (!prev || !prev._raw) return prev;
                    const newRaw = JSON.parse(JSON.stringify(prev._raw));
                    let found = false;
                    for (const m of newRaw.modules || []) {
                        for (const l of m.lessons || []) {
                            for (const t of l.topics || []) {
                                if (t.id === topicId) {
                                    t.is_completed = true;
                                    found = true;
                                    break;
                                }
                            }
                            if (found) break;
                        }
                        if (found) break;
                    }
                    if (found) return normalizeCourseData(newRaw);
                    return prev;
                });
            } catch (err) {
                console.error("Failed to mark topic complete:", err);
            }
        }

        // Navigate to tutor page
        router.push(`/tutor/${topicId}`);
    };

    useEffect(() => {
        if (curriculumData) {
            setCompletionPercentage(curriculumData.completionPercentage);
            if (curriculumData.isStarted) {
                setIsStarted(true);
            }
        }
    }, [curriculumData]);

    const handleOpenQuiz = (moduleId, moduleTitle) => {
        setActiveQuizModule({ id: moduleId, title: moduleTitle });
        setShowQuizModal(true);
    };

    const handleQuizComplete = (score) => {
        setShowQuizModal(false);
        setActiveQuizModule(null);
        setCurriculumData(prev => {
            if (!prev) return prev;
            const newRaw = JSON.parse(JSON.stringify(prev._raw));
            const modIndex = newRaw.modules.findIndex(m => m.id === activeQuizModule.id);
            if (modIndex !== -1) {
                newRaw.modules[modIndex].quiz_completed = true;
            }
            return normalizeCourseData(newRaw);
        });
    };

    if (loading) {
        return <CourseSkeleton />;
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
                <div className={styles.courseImage}>
                    <ZapIcon size={64} fill="white" />
                </div>
                <div className={styles.courseInfo}>
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

                <button className={styles.iconButton} title="Share Course" onClick={() => setShowShareModal(true)}>
                    <ShareIcon />
                </button>
            </div>

            {showShareModal && (
                <ShareModal
                    onClose={() => setShowShareModal(false)}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                    title={curriculumData.curriculum_title || 'Check out this course!'}
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
                />
            )}

            {isStarted && (
                <div className={styles.progressContainer}>
                    <div className={styles.progressLabel}>
                        <span>Course Progress</span>
                        <span>{completionPercentage}% completed</span>
                    </div>
                    <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
            )}

            <div className={styles.content}>

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
                                                    {lesson.topics && lesson.topics.map((topic, tIdx) => {
                                                        const firstId = curriculumData.modules[0]?.module_id !== undefined ? curriculumData.modules[0].module_id : 0;
                                                        const isFirstTopic = uniqueId === firstId && lessonIdx === 0 && tIdx === 0;

                                                        let elementId = null;
                                                        if (topic.isNextUp) elementId = "next-up-topic";
                                                        else if (isFirstTopic) elementId = "first-topic";

                                                        return (
                                                            <div
                                                                key={tIdx}
                                                                id={elementId}
                                                                className={`
                                                                    ${styles.resourceCard}
                                                                    ${topic.is_completed ? styles.completedResource : ''}
                                                                    ${isFirstTopic && highlightResource ? styles.highlight : ""}
                                                                    ${topic.isNextUp ? styles.nextUpResource : ""}
                                                                    ${topic.isNextUp && highlightResource ? styles.highlight : ""}
                                                                `}
                                                                onClick={() => handleTopicClick(topic.topic_id, topic.is_completed, topic.isLocked)}
                                                                style={{
                                                                    opacity: topic.isLocked ? 0.6 : 1,
                                                                    cursor: topic.isLocked ? 'not-allowed' : 'pointer',
                                                                }}
                                                            >
                                                                {topic.isNextUp && <div className={styles.nextUpBadge}>Next Up</div>}

                                                                <div className={`${styles.resourceIcon} ${styles.mediaIcon}`}>
                                                                    <VideoIcon size={20} />
                                                                </div>
                                                                <div className={styles.resourceInfo}>
                                                                    <div className={styles.resourceHeaderRow}>
                                                                        <div className={styles.resourceTitleGroup}>
                                                                            <span className={styles.resourceLabel}>{topic.title}</span>
                                                                        </div>
                                                                    </div>
                                                                    <p className={styles.resourceDescription}>{topic.description}</p>
                                                                </div>
                                                                <div className={styles.badgeContainer}>
                                                                    <span className={styles.xpBadge}>+11 XP</span>
                                                                    <span className={styles.resourceTypeBadge}>
                                                                        <VideoIcon size={12} />
                                                                        Video
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}

                                        <div style={{ marginTop: '1.5rem' }}>
                                            <button
                                                id={module.isQuizNextUp ? "next-up-topic" : null}
                                                className={`${styles.resourceCard} ${module.isQuizNextUp ? styles.highlight : ''}`}
                                                disabled={module.isQuizLocked}
                                                style={{
                                                    width: '100%',
                                                    background: module.quiz_completed
                                                        ? 'rgba(16, 185, 129, 0.1)'
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
