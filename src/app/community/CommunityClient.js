"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import PostCard from '@/components/PostCard';
import CreateCommunityModal from '@/components/CreateCommunityModal';
import CommunityStories from '@/components/CommunityStories';
import { useCommunity } from '@/components/CommunityContext';
import { PlusIcon } from '@/components/Icons';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import PostSkeleton from '@/components/PostSkeleton';


export default function CommunityClient() {
    const {
        communities,
        posts,
        user,
        createCommunity,
        joinCommunity,
        fetchUserFeed,
        fetchExploreFeed,
        loadMorePosts,
        loadingPosts,
        loading,
        requireAuth,
        fetchExploreCommunities
    } = useCommunity();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [feedTab, setFeedTab] = useState('feed');
    const [initialized, setInitialized] = useState(false);
    const router = useRouter();
    const [hasCheckedEmptyFeed, setHasCheckedEmptyFeed] = useState(false);

    useEffect(() => {
        if (!loading && !initialized) {
            if (user) {
                setFeedTab('feed');
                fetchUserFeed(true);
                // Lazy fetch explore communities for the sidebar "Explore" list
                if (fetchExploreCommunities) fetchExploreCommunities();
            } else {
                setFeedTab('explore');
                fetchExploreFeed(true);
            }
            setInitialized(true);
        }
    }, [user, loading, initialized, fetchUserFeed, fetchExploreFeed]);

    useEffect(() => {
        if (user && feedTab === 'explore' && !initialized) {
            setFeedTab('feed');
            fetchUserFeed(true);
        }
    }, [user]);


    // Auto-switch to explore if feed is empty (UX improvement)
    // Auto-switch to explore if feed is empty (UX improvement)
    useEffect(() => {
        if (user && initialized && !loadingPosts && feedTab === 'feed' && !hasCheckedEmptyFeed) {
            if (posts.length === 0) {
                setFeedTab('explore');
                fetchExploreFeed(true);
            }
            setHasCheckedEmptyFeed(true);
        }
    }, [user, initialized, loadingPosts, posts.length, feedTab, hasCheckedEmptyFeed, fetchExploreFeed]);

    const loadMoreRef = useIntersectionObserver({
        onIntersect: () => {
            if (!loadingPosts && loadMorePosts) {
                loadMorePosts();
            }
        },
        enabled: !loadingPosts && posts.length > 0,
        rootMargin: '200px'
    });

    const handleCreateCommunity = async (data) => {
        const newSlug = await createCommunity(data);
        setShowCreateModal(false);
        router.push(`/community/${newSlug}`);
    };

    const handleTabChange = (tab) => {
        setFeedTab(tab);
        if (tab === 'feed') fetchUserFeed(true);
        if (tab === 'explore') fetchExploreFeed(true);
    };

    const exploreCommunities = communities.filter(c => !c.isJoined);

    const ExploreSidebar = () => (
        <div className={styles.trendingCard}>
            <h3 className={styles.cardTitle}>Explore Communities</h3>
            <div className={styles.trendingList}>
                {exploreCommunities.slice(0, 5).map(c => (
                    <div
                        key={c.id}
                        className={styles.trendingItem}
                        onClick={() => router.push(`/community/${c.id}`)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <div
                                className={styles.exploreAvatar}
                                style={{ background: `linear-gradient(135deg, ${c.color || '#6366f1'}, ${c.color ? c.color + 'dd' : '#a855f7'})` }}
                            >
                                {c.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className={styles.hashtag}>{c.name}</span>
                        </div>
                        <button
                            className={styles.joinBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                requireAuth(() => joinCommunity(c.id));
                            }}
                        >
                            Join
                        </button>
                    </div>
                ))}
                {exploreCommunities.length === 0 && (
                    <div style={{ color: 'var(--secondary)', fontSize: '0.9rem' }}>No new communities to explore.</div>
                )}
            </div>
        </div>
    );

    const PostFeed = () => (
        <>
            {(loadingPosts || !initialized) && posts.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            ) : (
                <>
                    {posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--secondary)' }}>
                            {feedTab === 'feed'
                                ? 'No posts from your communities yet. Join more groups!'
                                : 'No posts found.'}
                        </div>
                    ) : (
                        posts.map(post => (
                            <PostCard key={post.id} {...post} />
                        ))
                    )}
                </>
            )}
            <div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }}>
                {loadingPosts && posts.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--secondary)', display: 'flex', justifyContent: 'center' }}>
                        <PostSkeleton />
                    </div>
                )}
            </div>
        </>
    );

    const MobileExploreList = () => (
        <div className={styles.trendingList}>
            {exploreCommunities.map(c => (
                <div
                    key={c.id}
                    className={styles.trendingItem}
                    onClick={() => router.push(`/community/${c.id}`)}
                    style={{ padding: '16px', background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <div
                            className={styles.exploreAvatar}
                            style={{
                                width: '48px', height: '48px', marginRight: '16px', fontSize: '1.1rem',
                                background: `linear-gradient(135deg, ${c.color || '#6366f1'}, ${c.color ? c.color + 'dd' : '#a855f7'})`
                            }}
                        >
                            {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <span className={styles.hashtag} style={{ fontSize: '1rem' }}>{c.name}</span>
                        </div>
                    </div>
                    <button
                        className={styles.joinBtn}
                        style={{ padding: '8px 20px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            requireAuth(() => joinCommunity(c.id));
                        }}
                    >
                        Join
                    </button>
                </div>
            ))}
            {exploreCommunities.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--secondary)' }}>
                    No new communities to explore right now.
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.page}>
            {showCreateModal && (
                <CreateCommunityModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={handleCreateCommunity}
                />
            )}

            {user && (
                <button className={styles.fab} onClick={() => setShowCreateModal(true)} title="Create Community">
                    <PlusIcon size={24} />
                </button>
            )}

            <div className={styles.mainColumn}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Community Flow</h1>
                    <p className={styles.subtitle}>Discover new groups and share your progress.</p>
                </div>

                <CommunityStories />

                <div className={styles.tabs}>
                    {user && (
                        <button
                            className={`${styles.tab} ${feedTab === 'feed' ? styles.active : ''}`}
                            onClick={() => handleTabChange('feed')}
                        >
                            Your Feed
                        </button>
                    )}
                    <button
                        className={`${styles.tab} ${feedTab === 'explore' ? styles.active : ''}`}
                        onClick={() => handleTabChange('explore')}
                    >
                        <span className={styles.desktopOnly}>Explore</span>
                        <span className={styles.mobileOnly}>Explore Communities</span>
                    </button>
                </div>

                <div className={styles.feed}>
                    {feedTab === 'explore' ? (
                        <>
                            <div className={styles.desktopOnly}>
                                <PostFeed />
                            </div>
                            <div className={styles.mobileOnly}>
                                <MobileExploreList />
                            </div>
                        </>
                    ) : (
                        <PostFeed />
                    )}
                </div>
            </div>

            <div className={styles.sidebar}>
                <ExploreSidebar />
            </div>

            <style jsx global>{`
        @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
        }
      `}</style>
        </div>
    );
}
