"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import PostCard from '@/components/PostCard';
import CommunityStories from '@/components/CommunityStories';
import CreateCommunityModal from '@/components/CreateCommunityModal';
import { useCommunity } from '@/components/CommunityContext';
import { PlusIcon } from '@/components/Icons';

export default function CommunityPage() {
  const { 
      communities, 
      posts, 
      createCommunity,
      joinCommunity
  } = useCommunity();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [feedTab, setFeedTab] = useState('foryou');
  const router = useRouter();

  const handleCreateCommunity = (data) => {
      const newSlug = createCommunity(data);
      setShowCreateModal(false);
      router.push(`/community/${newSlug}`);
  };

  const filteredPosts = posts.filter(p => {
     if (feedTab === 'following') {
         const myCommunityIds = communities.filter(c => c.isJoined).map(c => c.id);
         return myCommunityIds.includes(p.communityId);
     }
     return true; // For You = All
  });

  return (
    <div className={styles.page}>
      
      {showCreateModal && (
         <CreateCommunityModal 
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateCommunity}
         />
      )}

      <div className={styles.mainColumn}>
        <div className={styles.header}>
            <h1 className={styles.title}>Community Flow</h1>
            <p className={styles.subtitle}>Discover new groups and share your progress.</p>
        </div>

        {/* Stories Rail */}
        <CommunityStories />

        <div className={styles.tabs}>
            <button 
                className={`${styles.tab} ${feedTab === 'foryou' ? styles.active : ''}`}
                onClick={() => setFeedTab('foryou')}
            >
                For You
            </button>
            <button 
                className={`${styles.tab} ${feedTab === 'following' ? styles.active : ''}`}
                onClick={() => setFeedTab('following')}
            >
                Following
            </button>
        </div>

        <div className={styles.feed}>
            {filteredPosts.map(post => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
      </div>

      <div className={styles.sidebar}>
        {/* Create Community Button - Uses new prominent style */}
        <button className={styles.createCommunityBtn} onClick={() => setShowCreateModal(true)} style={{marginBottom: '24px'}}>
             <PlusIcon size={18} /> Create Community
        </button>

        <div className={styles.trendingCard}>
            <h3 className={styles.cardTitle}>Explore Communities</h3>
            <div className={styles.trendingList}>
                {/* Increased slice to show more communities */}
                {communities.filter(c => !c.isJoined).slice(0, 10).map(c => (
                     <div 
                        key={c.id} 
                        className={styles.trendingItem} 
                     >
                        <div onClick={() => router.push(`/community/${c.id}`)} style={{cursor:'pointer', flex:1, display:'flex', alignItems:'center'}}>
                            {/* Avatar for explore list */}
                            <div 
                                className={styles.exploreAvatar}
                                style={{background: `linear-gradient(135deg, ${c.color || '#6366f1'}, ${c.color ? c.color+'dd' : '#a855f7'})`}}
                            >
                                {c.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <span className={styles.hashtag}>{c.name}</span>
                                <span className={styles.count}>{c.memberCount} members</span>
                            </div>
                        </div>
                        <button 
                            className={styles.joinBtn}
                            onClick={(e) => {
                                e.stopPropagation();
                                joinCommunity(c.id);
                            }}
                        >
                            Join
                        </button>
                    </div>
                ))}
                {communities.filter(c => !c.isJoined).length === 0 && (
                    <div style={{color:'var(--foreground-muted)', fontSize:'0.9rem', padding:'8px'}}>
                        You have joined all communities!
                    </div>
                )}
            </div>
        </div>
        
        {/* Removed Trending Topics Card */}
      </div>

    </div>
  );
}
