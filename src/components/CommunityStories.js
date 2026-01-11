"use client";
import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from './Icons';
import styles from './CommunityStories.module.css';
import { useCommunity } from './CommunityContext';
import LoadingLogo from './LoadingLogo';

export default function CommunityStories() {
  const { communities, user, loading } = useCommunity();
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  // If user is logged in, show joined communities.
  // If user is guest, show explore/trending communities.
  const displayCommunities = user 
      ? communities.filter(c => c.isJoined)
      : communities.filter(c => !c.isJoined); 
      
  const title = user ? "Your Communities" : "Explore Communities";
  
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
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftArrow(scrollLeft > 0);
        // Check if scrolled to end (allow 1px for float precision). 
        // If content fits (scrollWidth <= clientWidth), this will also be false.
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
      // Run initially to set correct state
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, [displayCommunities.length]); // Re-run if list length changes

  return (
    <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom: '16px', marginTop: '8px'}}>
        <div style={{
            fontSize: '0.9rem', 
            color: 'var(--foreground)', 
            fontWeight: '700',
            marginLeft: '4px'
        }}>
           {loading ? <LoadingLogo size={20} /> : title}
        </div>

        <div className={styles.container}>
            {showLeftArrow && !loading && (
                <button 
                    className={`${styles.navBtn} ${styles.navBtnLeft}`} 
                    onClick={() => scroll('left')}
                    aria-label="Scroll Left"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            <div className={styles.storiesRail} ref={scrollRef}>
            
            {loading ? (
                 // Skeletons
                 Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={styles.storyItem} style={{pointerEvents: 'none'}}>
                        <div className={styles.ringContainer} style={{border:'2px solid var(--border)', background: 'var(--card)'}}>
                             <div className={styles.avatar} style={{background: 'var(--border)', animation: 'pulse 1.5s infinite'}}></div>
                        </div>
                        <div style={{width: '60px', height:'10px', background:'var(--border)', borderRadius:'4px', marginTop:'8px', animation: 'pulse 1.5s infinite'}}></div>
                    </div>
                 ))
            ) : (
                <>
                    {displayCommunities.map(community => (
                        <Link href={`/community/${community.id}`} key={community.id} className={styles.storyItem}>
                        <div className={`${styles.ringContainer} ${user ? styles.joined : styles.discover}`}>
                            <div className={styles.avatar}>
                                {community.name.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                        <span className={styles.name}>{community.name}</span>
                        </Link>
                    ))}

                    {displayCommunities.length === 0 && (
                        <div style={{padding:'12px', color:'var(--foreground-muted)', fontSize:'0.9rem'}}>
                            {user ? "Join a community to see it here!" : "No communities found."}
                        </div>
                    )}
                </>
            )}
            </div>

            {!loading && showRightArrow && (
                <button 
                    className={`${styles.navBtn} ${styles.navBtnRight}`} 
                    onClick={() => scroll('right')}
                    aria-label="Scroll Right"
                >
                    <ChevronRight size={20} />
                </button>
            )}
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
