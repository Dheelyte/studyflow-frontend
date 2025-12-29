"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from "./page.module.css";
import Card from "@/components/Card";
import GenerationOverlay from "@/components/GenerationOverlay";
import IntegratedSearchBar from "@/components/IntegratedSearchBar";
import { ZapIcon, StarIcon, TrophyIconSimple } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { curriculum } from '@/services/api';

export default function Dashboard() {
    const [greeting, setGreeting] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [genParams, setGenParams] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const router = useRouter();
    const { user, checkUser } = useAuth();

    // Initial Check & Greeting
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        checkUser();
    }, []); // Run ONCE on mount

    // Fetch Playlists when User is available
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await curriculum.getMyPlaylists();
                if (Array.isArray(response)) {
                    // Map to Card props
                    const colors = [
                        'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        'linear-gradient(135deg, #ec4899, #f43f5e)',
                        'linear-gradient(135deg, #10b981, #06b6d4)',
                        'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        'linear-gradient(135deg, #3b82f6, #0ea5e9)'
                    ];

                    const mapped = response.map((item, index) => ({
                        id: item.id,
                        title: item.playlist?.title || "Untitled",
                        description: "0% Complete • Just Started", // Mock
                        color: colors[index % colors.length],
                        link: `/playlist/${item.playlist?.id || 1}`
                    }));

                    setPlaylists(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard playlists", error);
            }
        };

        if (user) {
            fetchPlaylists();
        }

    }, [user?.id]); // Only refetch if User ID changes

    const handleSearch = (params) => {
        setGenParams(params);
        setIsGenerating(true);
    };

    const onGenerationComplete = () => {
        if (!genParams) return;

        const query = {
            topic: genParams.topic,
            experience: genParams.experience,
            duration: genParams.duration
        };
        const queryString = new URLSearchParams(query).toString();
        router.push(`/playlist/1?${queryString}`);
    };

    // Derived stats from user context
    const stats = {
        level: user?.level || 1,
        streak: user?.current_streak || 0,
        totalXp: user?.total_xp || 0,
        title: user?.level_name || "Novice"
    };

    return (
        <div className={styles.page}>

            {isGenerating && genParams && (
                <GenerationOverlay
                    topic={genParams.topic}
                    experience={genParams.experience}
                    onComplete={onGenerationComplete}
                />
            )}

            <div className={styles.heroSection}>
                <h1 className={styles.greeting}>{greeting || 'Hello'}, {user?.first_name || 'Alex'}. Ready to flow?</h1>
                <IntegratedSearchBar onSearch={handleSearch} />
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#eab308' }}>
                        <ZapIcon size={24} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.streak}</span>
                        <span className={styles.statLabel}>Day Streak</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#3b82f6' }}>
                        <StarIcon size={24} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.totalXp}</span>
                        <span className={styles.statLabel}>Total XP</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ color: '#10b981' }}>
                        <TrophyIconSimple size={24} />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.title}</span>
                        <span className={styles.statLabel}>Level {stats.level}</span>
                    </div>
                </div>
            </div>

            {/* Jump Back In Section - Dynamic */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Jump Back In</h2>
                    <Link href="/library" className={styles.showAll}>View Library</Link>
                </div>
                <div className={styles.grid}>
                    {playlists.length > 0 ? (
                        playlists.slice(0, 3).map(playlist => (
                            <Link key={playlist.id} href={playlist.link} style={{ display: 'contents' }}>
                                <Card title={playlist.title} description={playlist.description} color={playlist.color} />
                            </Link>
                        ))
                    ) : (
                        <div style={{ color: 'var(--secondary)', padding: '20px', gridColumn: '1/-1' }}>
                            No recent activity. Start a new topic above!
                        </div>
                    )}
                </div>
            </section>

            {/* Recommended Section - Static for now, logic not requested */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recommended based on your goals</h2>
                    <span className={styles.showAll}>Explore More</span>
                </div>
                <div className={styles.grid}>
                    <Link href="/playlist/1" style={{ display: 'contents' }}>
                        <Card title="Advanced Next.js" description="Master Server Components" color="linear-gradient(135deg, #020617, #334155)" />
                    </Link>
                    <Link href="/playlist/1" style={{ display: 'contents' }}>
                        <Card title="GenAI Engineering" description="LLMs, RAG, and Agents" color="linear-gradient(135deg, #3b82f6, #2563eb)" />
                    </Link>
                    <Link href="/playlist/1" style={{ display: 'contents' }}>
                        <Card title="Docker Mastery" description="Containerization from scratch" color="linear-gradient(135deg, #0ea5e9, #0284c7)" />
                    </Link>
                </div>
            </section>

        </div>
    );
}
