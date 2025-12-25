"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import PostCard from '@/components/PostCard';
import CreateCommunityModal from '@/components/CreateCommunityModal';
import CommunityStories from '@/components/CommunityStories';
import { useCommunity } from '@/components/CommunityContext';
import { PlusIcon } from '@/components/Icons';

// Post Skeleton Component
const PostSkeleton = () => (
    <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '16px'
    }}>
       <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
           <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--border)', animation: 'pulse 1.5s infinite'}}></div>
           <div style={{flex: 1}}>
               <div style={{width: '30%', height:'14px', background:'var(--border)', borderRadius:'4px', marginBottom:'6px', animation: 'pulse 1.5s infinite'}}></div>
               <div style={{width: '15%', height:'12px', background:'var(--border)', borderRadius:'4px', animation: 'pulse 1.5s infinite'}}></div>
           </div>
       </div>
       <div style={{marginBottom:'24px'}}>
            <div style={{width: '100%', height:'16px', background:'var(--border)', borderRadius:'4px', marginBottom:'8px', animation: 'pulse 1.5s infinite'}}></div>
            <div style={{width: '90%', height:'16px', background:'var(--border)', borderRadius:'4px', marginBottom:'8px', animation: 'pulse 1.5s infinite'}}></div>
       </div>
    </div>
);

export default function CommunityPage() {
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
      loading, // Global loading for communities
      requireAuth
  } = useCommunity();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedTab, setFeedTab] = useState('feed'); 
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
      // PROACTIVELY wait for loading to complete to avoid false negatives on auth
      if (!loading && !initialized) {
           if (user) {
              setFeedTab('feed');
              fetchUserFeed(true);
          } else {
              setFeedTab('explore');
              fetchExploreFeed(true);
          }
          setInitialized(true);
      }
  }, [user, loading, initialized, fetchUserFeed, fetchExploreFeed]);

  // If user state changes later (e.g. login), switch tabs
  useEffect(() => {
     if (user && feedTab === 'explore' && !initialized) {
         setFeedTab('feed');
         fetchUserFeed(true);
     }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 200) {
            if (!loadingPosts) {
                loadMorePosts();
            }
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts, loadingPosts]);

  const handleCreateCommunity = (data) => {
      const newSlug = createCommunity(data);
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
                        <div style={{display:'flex', alignItems:'center', flex:1}}>
                             <div 
                                className={styles.exploreAvatar}
                                style={{background: `linear-gradient(135deg, ${c.color || '#6366f1'}, ${c.color ? c.color+'dd' : '#a855f7'})`}}
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
                    <div style={{color:'var(--secondary)', fontSize:'0.9rem'}}>No new communities to explore.</div>
                )}
            </div>
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
      
      {/* Floating Action Button */}
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

        {/* Improved Horizontal List (Visible to all) */}
        <CommunityStories />

        {/* Tabs */}
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
                Explore
            </button>
        </div>

        {/* Feed Content */}
        <div className={styles.feed}>
             {(loadingPosts || !initialized) && posts.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            ) : (
                <>
                    {posts.length === 0 ? (
                        <div style={{textAlign:'center', padding:'40px', color:'var(--secondary)'}}>
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
             {/* Infinite Scroll Loader */}
            {loadingPosts && posts.length > 0 && (
                <div style={{textAlign:'center', padding:'20px', color:'var(--secondary)'}}>Loading more...</div>
            )}
        </div>
      </div>

      {/* Right Sidebar (Desktop) */}
      <div className={styles.sidebar}>
         <ExploreSidebar />
      </div>
    </div>
  );
}
