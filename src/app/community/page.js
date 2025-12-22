"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import PostCard from '@/components/PostCard';
import CommunityStories from '@/components/CommunityStories';
import CreateCommunityModal from '@/components/CreateCommunityModal';
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
            <div style={{width: '60%', height:'16px', background:'var(--border)', borderRadius:'4px', animation: 'pulse 1.5s infinite'}}></div>
       </div>

       <div style={{display:'flex', gap:'24px', borderTop:'1px solid var(--border)', paddingTop:'16px'}}>
           <div style={{width: '20px', height:'20px', background:'var(--border)', borderRadius:'4px', animation: 'pulse 1.5s infinite'}}></div>
           <div style={{width: '20px', height:'20px', background:'var(--border)', borderRadius:'4px', animation: 'pulse 1.5s infinite'}}></div>
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
      if (!initialized && typeof user !== 'undefined') {
          if (user) {
              setFeedTab('feed');
              fetchUserFeed(true);
          } else {
              setFeedTab('explore');
              fetchExploreFeed(true);
          }
          setInitialized(true);
      }
  }, [user, initialized, fetchUserFeed, fetchExploreFeed]);

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

  const ExploreList = () => (
      <div className={styles.trendingList}>
             {loading ? (
                 // Sidebar Loading Skeletons
                 Array.from({ length: 5 }).map((_, i) => (
                     <div key={i} className={styles.trendingItem} style={{pointerEvents: 'none'}}>
                        <div style={{display:'flex', alignItems:'center', flex: 1}}>
                            <div className={styles.exploreAvatar} style={{background: 'var(--border)', animation: 'pulse 1.5s infinite'}}></div>
                            <div style={{flex: 1}}>
                                <div style={{width: '60%', height:'12px', background:'var(--border)', borderRadius:'4px', marginBottom:'4px', animation: 'pulse 1.5s infinite'}}></div>
                                <div style={{width: '30%', height:'10px', background:'var(--border)', borderRadius:'4px', animation: 'pulse 1.5s infinite'}}></div>
                            </div>
                        </div>
                     </div>
                 ))
             ) : (
                exploreCommunities.slice(0, 10).map(c => (
                     <div 
                        key={c.id} 
                        className={styles.trendingItem} 
                        style={{background: 'var(--card)', borderRadius:'8px', padding:'12px', marginBottom:'8px', border:'1px solid var(--border)'}}
                     >
                        <div onClick={() => router.push(`/community/${c.id}`)} style={{cursor:'pointer', flex:1, display:'flex', alignItems:'center'}}>
                            <div 
                                className={styles.exploreAvatar}
                                style={{background: `linear-gradient(135deg, ${c.color || '#6366f1'}, ${c.color ? c.color+'dd' : '#a855f7'})`}}
                            >
                                {c.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <span className={styles.hashtag}>{c.name}</span>
                                <span className={styles.count}>{c.memberCount || 0} members</span>
                            </div>
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
                ))
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
          <button className={`${styles.fab} ${styles.mobileOnly}`} onClick={() => setShowCreateModal(true)}>
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
                className={`${styles.tab} ${feedTab === 'explore' ? styles.active : ''} ${user ? styles.mobileOnly : ''}`}
                onClick={() => handleTabChange('explore')}
            >
                Explore
            </button>
        </div>

        <div className={styles.feed}>
            {/* Initial Loading State for Feed */}
            {loadingPosts && posts.length === 0 ? (
                Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
            ) : (
                feedTab === 'feed' ? (
                    <>
                        {posts.length === 0 ? (
                             <div style={{textAlign:'center', padding:'40px', color:'var(--secondary)'}}>
                                No posts from your communities yet. Join more groups!
                            </div>
                        ) : (
                            posts.map(post => (
                                <PostCard key={post.id} {...post} />
                            ))
                        )}
                    </>
                ) : (
                    <>
                        {!user ? (
                             <>
                                <div style={{marginBottom:'16px', color:'var(--secondary)'}}>Latest updates from the community</div>
                                 {posts.length === 0 ? (
                                    <div style={{textAlign:'center', padding:'40px', color:'var(--secondary)'}}>
                                        No posts found.
                                    </div>
                                ) : (
                                    posts.map(post => (
                                        <PostCard key={post.id} {...post} />
                                    ))
                                )}
                             </>
                        ) : (
                            <div style={{marginTop:'16px'}}>
                                <h3 className={styles.cardTitle} style={{marginBottom:'16px'}}>Explore Communities</h3>
                                <ExploreList />
                            </div>
                        )}
                    </>
                )
            )}
            
            {/* Infinite Scroll Loading */}
            {loadingPosts && posts.length > 0 && (
                <div style={{textAlign:'center', padding:'20px', color:'var(--secondary)'}}>
                    Loading more...
                </div>
            )}
        </div>
      </div>

      <div className={styles.sidebar}>
        {user && (
            <button className={styles.createCommunityBtn} onClick={() => setShowCreateModal(true)} style={{marginBottom: '24px'}}>
                <PlusIcon size={18} /> Create Community
            </button>
        )}

        <div className={styles.trendingCard}>
            <h3 className={styles.cardTitle}>Explore Communities</h3>
            <div className={styles.trendingList}>
                {/* Sidebar Loading Logic inside ExploreList if reused? Or inline here */}
                {/* To keep it clean, let's duplicate the logic or extract component better.
                    For now, inline logic for sidebar specifically.
                */}
                {loading ? (
                     Array.from({ length: 5 }).map((_, i) => (
                         <div key={i} className={styles.trendingItem} style={{pointerEvents: 'none'}}>
                            <div style={{display:'flex', alignItems:'center', flex: 1}}>
                                <div className={styles.exploreAvatar} style={{background: 'var(--border)', animation: 'pulse 1.5s infinite'}}></div>
                                <div style={{flex: 1}}>
                                    <div style={{width: '60%', height:'12px', background:'var(--border)', borderRadius:'4px', marginBottom:'4px', animation: 'pulse 1.5s infinite'}}></div>
                                    <div style={{width: '30%', height:'10px', background:'var(--border)', borderRadius:'4px', animation: 'pulse 1.5s infinite'}}></div>
                                </div>
                            </div>
                         </div>
                     ))
                ) : (
                    exploreCommunities.slice(0, 10).map(c => (
                         <div 
                            key={c.id} 
                            className={styles.trendingItem} 
                         >
                            <div onClick={() => router.push(`/community/${c.id}`)} style={{cursor:'pointer', flex:1, display:'flex', alignItems:'center'}}>
                                <div 
                                    className={styles.exploreAvatar}
                                    style={{background: `linear-gradient(135deg, ${c.color || '#6366f1'}, ${c.color ? c.color+'dd' : '#a855f7'})`}}
                                >
                                    {c.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <span className={styles.hashtag}>{c.name}</span>
                                    <span className={styles.count}>{c.memberCount || 0} members</span>
                                </div>
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
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
