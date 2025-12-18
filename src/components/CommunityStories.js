"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from './Icons';
import styles from './CommunityStories.module.css';
import { useCommunity } from './CommunityContext';

export default function CommunityStories() {
  const { communities } = useCommunity();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  
  const joinedCommunities = communities.filter(c => c.isJoined);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 300;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setShowLeftArrow(scrollRef.current.scrollLeft > 0);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    // Increased marginBottom (spacing to posts)
    // Removed gap from container to better control label spacing
    // Added marginTop to separate from page title
    <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom: '24px', marginTop: '16px'}}>
        <div style={{
            fontSize: '0.9rem', 
            color: 'var(--foreground)', 
            fontWeight: '700',
            marginLeft: '4px'
        }}>
           Your Communities
        </div>

        <div className={styles.container}>
            {showLeftArrow && (
                <button 
                    className={`${styles.navBtn} ${styles.navBtnLeft}`} 
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            <div className={styles.storiesRail} ref={scrollRef}>
            
            {joinedCommunities.map(community => (
                <Link href={`/community/${community.id}`} key={community.id} className={styles.storyItem}>
                <div className={`${styles.ringContainer} ${styles.joined}`}>
                    <div className={styles.avatar}>
                        {community.name.substring(0, 2).toUpperCase()}
                    </div>
                </div>
                <span className={styles.name}>{community.name}</span>
                </Link>
            ))}

            {joinedCommunities.length === 0 && (
                <div style={{padding:'12px', color:'var(--foreground-muted)', fontSize:'0.9rem'}}>
                    Join a community to see it here!
                </div>
            )}
            </div>

            <button 
                className={`${styles.navBtn} ${styles.navBtnRight}`} 
                onClick={() => scroll('right')}
                aria-label="Scroll Right"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    </div>
  );
}
