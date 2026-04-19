"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import GenerationOverlay from '@/components/GenerationOverlay';
import { curriculum } from "@/services/api";
import styles from "./page.module.css";
import { useAuth } from "@/context/AuthContext";
import { useRedirectState } from "@/hooks/useRedirectState";
import ShareModal from "@/components/ShareModal";
import Link from "next/link";
import { PlayIcon, ClockIcon, ChevronDown, ChevronUp, ZapIcon, ShareIcon, CheckCircleIcon, BookOpenIcon, VideoIcon, TrophyIconSimple } from "@/components/Icons";

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
    const [isCreating, setIsCreating] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);
    const startBtnRef = useRef(null);

    const handleTopicClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (startBtnRef.current) {
            startBtnRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setIsGlowing(true);
            setTimeout(() => setIsGlowing(false), 2000);
        }
    };

    const fetchedTopicRef = useRef(null);

    useEffect(() => {
        const fetchCurriculum = async () => {
            const topic = searchParams.get("topic");

            const restoredState = restoreState('curriculum_data');
            if (restoredState && restoredState.data) {
                setCurriculumData(restoredState.data);
                if (restoredState.data.modules && restoredState.data.modules.length > 0) {
                    const firstId = restoredState.data.modules[0].module_id !== undefined ? restoredState.data.modules[0].module_id : 0;
                    setExpandedModules({ [firstId]: true });
                }
                if (topic) {
                    fetchedTopicRef.current = topic;
                }
                setLoading(false);
                return;
            }

            if (!topic) {
                setLoading(false);
                return;
            }

            if (fetchedTopicRef.current === topic) {
                return;
            }
            fetchedTopicRef.current = topic;

            try {
                setLoading(true);
                const params = { topic };

                const data = await curriculum.generate(params);

                if (!data || !data.modules) {
                    throw new Error("Invalid curriculum data format received");
                }

                setCurriculumData(data);

                if (data.modules && data.modules.length > 0) {
                    const firstId = data.modules[0].module_id !== undefined ? data.modules[0].module_id : 0;
                    setExpandedModules({ [firstId]: true });
                }
            } catch (err) {
                console.error("Failed to fetch curriculum:", err);
                setError(err.message || "Failed to load curriculum");
                fetchedTopicRef.current = null;
            } finally {
                setLoading(false);
            }
        };

        fetchCurriculum();
    }, [searchParams, restoreState]);

    const toggleModule = (id) => {
        setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handlePlay = async () => {
        if (!user) {
            saveState('curriculum_data', curriculumData);
            const redirectUrl = encodeURIComponent(`${pathname}?${searchParams.toString()}`);
            router.push(`/login?redirect=${redirectUrl}`);
            return;
        }

        try {
            setIsCreating(true);
            const payload = {
                title: curriculumData.curriculum_title,
                description: curriculumData.overview,
                objectives: curriculumData.learning_objectives || [],
                content: curriculumData
            };

            const response = await curriculum.createCourse(payload);

            if (response && response.id) {
                router.push(`/course/${response.id}`);
            } else {
                console.error("Created course but got no ID", response);
                alert("Failed to create course. Please try again.");
            }
        } catch (e) {
            console.error("Failed to create course", e);
            alert("Failed to save course. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    if (showOverlay) {
        return (
            <GenerationOverlay
                topic={searchParams.get("topic")}
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

            <header className={styles.topNav}>
                <div className={styles.navBrand}>
                    <ZapIcon size={24} fill="var(--primary)" />
                    <span>Primerly</span>
                </div>
                {!user && (
                    <Link href="/login" className={styles.navLoginBtn}>
                        Log In
                    </Link>
                )}
            </header>

            <div className={styles.header}>
                <div className={styles.courseImage}>
                    <span style={{ fontSize: "1.5rem", fontWeight: "800", textAlign: "center", lineHeight: "1.2", padding: "16px" }}>
                        {curriculumData.curriculum_title}
                    </span>
                </div>
                <div className={styles.courseInfo}>
                    <h1 className={styles.title}>{curriculumData.curriculum_title}</h1>
                    <p className={styles.description}>{curriculumData.overview}</p>
                </div>
            </div>

            <div className={styles.controls}>
                <button ref={startBtnRef} className={`${styles.playButton} ${isGlowing ? styles.glowing : ""}`} onClick={handlePlay} disabled={isCreating}>
                    <PlayIcon size={24} fill="white" />
                    {isCreating ? "Creating Course..." : "Start Learning"}
                </button>

                <button className={styles.iconButton} title="Share Course" onClick={() => setIsShareModalOpen(true)}>
                    <ShareIcon />
                </button>
            </div>

            <div className={styles.content}>

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
                                                    {lesson.topics && lesson.topics.map((topic, tIdx) => (
                                                        <div
                                                            key={tIdx}
                                                            className={`${styles.resourceCard} ${styles.resourceDisabled}`}
                                                            onClick={(e) => handleTopicClick(e)}
                                                            title="Click 'Start Learning' to create your course first"
                                                        >
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
                                                    ))}
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
