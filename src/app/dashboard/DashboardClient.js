"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from "./page.module.css";
import Card from "@/components/Card";
import SkeletonCard from "@/components/SkeletonCard";
import IntegratedSearchBar from "@/components/IntegratedSearchBar";
import { ZapIcon, StarIcon, TrophyIconSimple, UsersIcon, ShareIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { curriculum, communities } from '@/services/api';
import StatShareModal from '@/components/StatShareModal';

export default function DashboardClient() {
    const [greeting, setGreeting] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [loadingPlaylists, setLoadingPlaylists] = useState(true);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [exploreCommunities, setExploreCommunities] = useState([]);
    const [loadingCommunities, setLoadingCommunities] = useState(true);
    const [myCommunities, setMyCommunities] = useState([]);
    const [loadingMyCommunities, setLoadingMyCommunities] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, checkUser } = useAuth();

    // Initial Check & Greeting
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good morning');
        else if (hour < 18) setGreeting('Good afternoon');
        else setGreeting('Good evening');

        // Check for login_success from Google Auth redirect
        if (searchParams && searchParams.get('login_success')) {
            // Force check to update local session state from HttpOnly cookie
            checkUser(true);
            // Clean URL without refresh
            window.history.replaceState({}, '', '/dashboard');
        } else {
            checkUser();
        }
    }, []); // Run ONCE on mount

    // Fetch Playlists and Communities when User is available
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Parallel fetch
                const [playlistsRes, myCommunitiesRes, exploreCommunitiesRes] = await Promise.all([
                    curriculum.getMyPlaylists().catch(e => []),
                    communities.getMyCommunities().catch(e => []),
                    communities.getExplore().catch(e => [])
                ]);

                // Process Playlists
                if (Array.isArray(playlistsRes)) {
                    const colors = [
                        'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        'linear-gradient(135deg, #ec4899, #f43f5e)',
                        'linear-gradient(135deg, #10b981, #06b6d4)',
                        'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        'linear-gradient(135deg, #3b82f6, #0ea5e9)'
                    ];
                    const mapped = playlistsRes.map((item, index) => ({
                        id: item.id,
                        title: item.playlist?.title || "Untitled",
                        description: "Your personalized curriculum",
                        color: colors[index % colors.length],
                        link: `/playlist/${item.playlist?.id || 1}`,
                        progress: item.progress?.percentage || 0,
                        completedModules: item.progress?.completed_modules || 0,
                        totalModules: item.progress?.total_modules || 0,
                        level: item.playlist?.level
                    }));
                    setPlaylists(mapped);
                }

                // Process My Communities
                if (Array.isArray(myCommunitiesRes)) {
                    setMyCommunities(myCommunitiesRes);
                }

                // Process Explore Communities
                if (Array.isArray(exploreCommunitiesRes)) {
                    setExploreCommunities(exploreCommunitiesRes.slice(0, 3));
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoadingCommunities(false);
                setLoadingPlaylists(false);
                setLoadingMyCommunities(false);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user?.id]);

    const handleSearch = (params) => {
        const query = {
            topic: params.topic,
            experience: params.experience,
            duration: params.duration
        };
        const queryString = new URLSearchParams(query).toString();
        router.push(`/curriculum?${queryString}`);
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


            <div className={styles.heroSection}>
                <h1 className={styles.greeting}>{greeting || 'Hello'}, {user?.first_name || 'Learner'}. Ready to flow?</h1>
                <IntegratedSearchBar redirect={true} shadow={false} />
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)} title="Share Stats">
                        <ShareIcon size={16} />
                    </button>
                    <div className={styles.statIcon} style={{ color: '#eab308' }}>
                        <ZapIcon size={24} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.streak}</span>
                        <span className={styles.statLabel}>Day Streak</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)} title="Share Stats">
                        <ShareIcon size={16} />
                    </button>
                    <div className={styles.statIcon} style={{ color: '#3b82f6' }}>
                        <StarIcon size={24} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.totalXp}</span>
                        <span className={styles.statLabel}>Total XP</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)} title="Share Stats">
                        <ShareIcon size={16} />
                    </button>
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
                <div className={styles.scrollContainer}>
                    {loadingPlaylists ? (
                        <>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                        </>
                    ) : playlists.length > 0 ? (
                        playlists.slice(0, 5).map(playlist => (
                            <Link key={playlist.id} href={playlist.link} style={{ minWidth: '280px', display: 'block', textDecoration: 'none' }}>
                                <Card title={playlist.title} description={playlist.description} color={playlist.color} progress={playlist.progress} completedModules={playlist.completedModules} totalModules={playlist.totalModules} level={playlist.level} />
                            </Link>
                        ))
                    ) : (
                        <div style={{ color: 'var(--secondary)', padding: '20px', minWidth: '300px' }}>
                            No recent activity. Start a new topic above!
                        </div>
                    )}
                </div>
            </section>

            {/* My Communities Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>My Communities</h2>
                    <Link href="/community" className={styles.showAll}>View All</Link>
                </div>
                <div className={styles.scrollContainer}>
                    {loadingMyCommunities ? (
                        <>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                        </>
                    ) : myCommunities.length > 0 ? (
                        myCommunities.map((comm) => (
                            <Link key={comm.id} href={'/community/' + comm.id} style={{ minWidth: '280px', display: 'block', textDecoration: 'none' }}>
                                <Card
                                    title={comm.name}
                                    description={comm.member_count + ' Members • ' + (comm.description || 'Join the discussion')}
                                    color="linear-gradient(135deg, #4f46e5, #818cf8)"
                                    icon={UsersIcon}
                                />
                            </Link>
                        ))
                    ) : (
                        <div style={{ color: 'var(--secondary)', padding: '20px', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <span>You haven&apos;t joined any communities yet.</span>
                            <Link href="/community" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Find a community →</Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Explore Communities Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Explore Communities</h2>
                    <Link href="/community" className={styles.showAll}>View All</Link>
                </div>
                <div className={styles.scrollContainer}>
                    {loadingCommunities ? (
                        <>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                            <div style={{ minWidth: '280px', height: '100%' }}><SkeletonCard /></div>
                        </>
                    ) : exploreCommunities.length > 0 ? (
                        exploreCommunities.map((comm) => (
                            <Link key={comm.id} href={'/community/' + comm.id} style={{ minWidth: '280px', display: 'block', textDecoration: 'none' }}>
                                <Card
                                    title={comm.name}
                                    description={comm.member_count + ' Members • ' + (comm.description || 'Join the discussion')}
                                    color="linear-gradient(135deg, #0f172a, #334155)"
                                    icon={UsersIcon}
                                />
                            </Link>
                        ))
                    ) : (
                        <div style={{ color: 'var(--secondary)', padding: '20px', minWidth: '300px' }}>
                            No communities found.
                        </div>
                    )}
                </div>
            </section>



            <StatShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                stats={stats}
                user={user}
            />
        </div>
    );
}