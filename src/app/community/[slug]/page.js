"use client";
import React, { useEffect } from 'react';
import { useCommunity } from '@/components/CommunityContext';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { ChevronLeft } from '@/components/Icons';
import Link from 'next/link';
import styles from '../page.module.css'; 
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import Spinner from '@/components/Spinner';

// Shared Post Skeleton
const PostSkeleton = () => (
    <div style={{
        marginBottom:'16px', 
        padding:'24px', 
        border:'1px solid var(--border)', 
        borderRadius:'16px', 
        background:'var(--card)'
    }}>
        <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--border)', animation:'pulse 1.5s infinite'}}></div>
            <div style={{flex:1}}>
                 <div style={{width:'30%', height:'14px', background:'var(--border)', borderRadius:'4px', marginBottom:'6px', animation:'pulse 1.5s infinite'}}></div>
                 <div style={{width:'20%', height:'12px', background:'var(--border)', borderRadius:'4px', animation:'pulse 1.5s infinite'}}></div>
            </div>
        </div>
        <div style={{width:'100%', height:'16px', background:'var(--border)', borderRadius:'4px', marginBottom:'8px', animation:'pulse 1.5s infinite'}}></div>
        <div style={{width:'80%', height:'16px', background:'var(--border)', borderRadius:'4px', animation:'pulse 1.5s infinite'}}></div>
    </div>
);

export default function CommunityDetail({ params }) {
    const { slug } = React.use(params);
    return <CommunityDetailContent slug={slug} />;
}

function CommunityDetailContent({ slug }) {
  const { user, getCommunity, posts, createPost, joinCommunity, leaveCommunity, fetchCommunityPosts, fetchCommunityDetails, loadingPosts, hasMorePosts, loadMorePosts } = useCommunity();
  const community = getCommunity(slug);
  const [fetchError, setFetchError] = React.useState(false);
  
  // Fetch posts AND details (for member count) when entering the community
  useEffect(() => {
      if (slug) {
         setFetchError(false);
         fetchCommunityPosts(slug);
         fetchCommunityDetails(slug).then(res => {
             // If no result and not already in store (getCommunity uses store)
             // We need to pass the updated function or rely on refetch result
             if (!res && !getCommunity(slug)) {
                 setFetchError(true);
             }
         });
      }
  }, [slug, fetchCommunityPosts, fetchCommunityDetails]);
  
  const loadMoreRef = useIntersectionObserver({
      onIntersect: () => {
        if (!loadingPosts && hasMorePosts()) {
            loadMorePosts();
        }
      },
      enabled: !loadingPosts && hasMorePosts(),
      rootMargin: '200px'
  });

  if (fetchError) {
      return (
         <div className={styles.page}>
             <div className={styles.mainColumn}>
                <Link href="/community" className={styles.backBtn} style={{display:'flex', gap:'8px', alignItems:'center', marginBottom:'24px', color:'var(--secondary)'}}>
                    <ChevronLeft size={16} /> Back to Hub
                </Link>
                <div style={{textAlign: 'center', padding: '60px 20px', color: 'var(--secondary)'}}>
                    <h2>Community not found</h2>
                    <p style={{marginTop:'8px'}}>The community you are looking for does not exist or has been removed.</p>
                </div>
             </div>
         </div>
      );
  }

  if (!community) {
      return (
        <div className={styles.page}>
            <div className={styles.mainColumn}>
                 <div style={{
                     display: 'flex', 
                     alignItems: 'center', 
                     gap: '8px', 
                     marginBottom: '24px', 
                     color: 'var(--secondary)',
                     fontSize: '0.9rem'
                 }}>
                    <ChevronLeft size={16} /> Back to Hub
                 </div>

                 {/* Header Skeleton */}
                 <div className={styles.header} style={{borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px'}}>
                     <div style={{display:'flex', gap:'24px', alignItems:'center'}}>
                         <div style={{width:'80px', height:'80px', borderRadius:'50%', background:'var(--border)', animation:'pulse 1.5s infinite'}}></div>
                         <div style={{flex:1}}>
                             <div style={{width:'40%', height:'24px', background:'var(--border)', borderRadius:'6px', marginBottom:'12px', animation:'pulse 1.5s infinite'}}></div>
                             <div style={{width:'70%', height:'16px', background:'var(--border)', borderRadius:'6px', animation:'pulse 1.5s infinite'}}></div>
                         </div>
                     </div>
                 </div>

                 {/* Post Skeletons */}
                 {Array.from({length: 3}).map((_, i) => <PostSkeleton key={i} />)}
            </div>
            
            {/* Sidebar Skeleton */}
            <div className={styles.sidebar}>
                 <div className={styles.trendingCard} style={{height:'180px', padding:'24px'}}>
                     <div style={{width:'50%', height:'20px', background:'var(--border)', borderRadius:'4px', marginBottom:'20px', animation:'pulse 1.5s infinite'}}></div>
                     <div style={{width:'100%', height:'14px', background:'var(--border)', borderRadius:'4px', marginBottom:'10px', animation:'pulse 1.5s infinite'}}></div>
                     <div style={{width:'90%', height:'14px', background:'var(--border)', borderRadius:'4px', marginBottom:'10px', animation:'pulse 1.5s infinite'}}></div>
                     <div style={{width:'60%', height:'14px', background:'var(--border)', borderRadius:'4px', animation:'pulse 1.5s infinite'}}></div>
                 </div>
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

  // Filter posts for this community
  const communityPosts = (posts || []).filter(p => p.community_id == slug || p.communityId == slug);

  return (
    <div className={styles.page}>
         {/* Reusing the grid layout */}
         
         <div className={styles.mainColumn}>
            <Link href="/community" className={styles.backBtn}>
                <ChevronLeft size={16} /> Back to Hub
            </Link>

            <div className={styles.header} style={{borderBottom: '1px solid var(--border)', paddingBottom: '24px', marginBottom: '24px'}}>
                 <div style={{display:'flex', gap:'24px', alignItems:'center'}}>
                     {/* Community Thumbnail */}
                     <div style={{
                         width:'80px', 
                         height:'80px', 
                         borderRadius:'50%', 
                         background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         fontSize: '2rem',
                         fontWeight: 'bold',
                         color: 'white',
                         flexShrink: 0
                     }}>
                         {community.name ? community.name.substring(0,2).toUpperCase() : '??'}
                     </div>

                     <div style={{flex:1}}>
                         {/* Title Section */}
                         <div style={{marginBottom: '16px'}}>
                            <h1 className={styles.title}>{community.name}</h1>
                            <p className={styles.subtitle}>{community.description}</p>
                         </div>
                         
                         {/* Metadata and Button Row */}
                         <div style={{display:'flex', gap:'8px', alignItems:'center', flexWrap:'wrap'}}>
                             <span style={{fontSize:'0.9rem', fontWeight:'600', color:'var(--foreground)'}}>
                                {community.memberCount !== undefined ? community.memberCount : '...'} <span style={{fontWeight:'400', color:'var(--secondary)'}}>{community.memberCount === 1 ? 'Member' : 'Members'}</span>
                             </span>
                             
                             <span style={{color:'var(--border)'}}>|</span>
                             
                             {community.tags && community.tags.map(t => (
                                 <span key={t} style={{fontSize:'0.8rem', background:'rgba(255,255,255,0.05)', padding:'4px 8px', borderRadius:'6px'}}>#{t}</span>
                             ))}

                             {/* Button moved here, pushed to right - Mobile Only */}
                             <div className={styles.mobileOnly} style={{marginLeft: 'auto'}}>
                                {community.isJoined ? (
                                    <button 
                                        className={styles.createBtn} 
                                        style={{width:'auto', padding:'8px 24px'}}
                                        onClick={() => leaveCommunity(community.id)}
                                    >
                                        Joined
                                    </button>
                                ) : (
                                    <button 
                                        className={styles.createBtn} 
                                        style={{width:'auto', background:'var(--primary)', color:'white', border:'none', padding:'8px 24px'}} 
                                        onClick={() => joinCommunity(community.id)}
                                    >
                                        Join
                                    </button>
                                )}
                             </div>
                         </div>
                     </div>
                 </div>
            </div>

            {user && <CreatePost onPost={(data) => createPost(data, community.id)} />}

            <div className={styles.feed}>
                {loadingPosts && communityPosts.length === 0 ? (
                    Array.from({length: 3}).map((_, i) => <PostSkeleton key={i} />)
                ) : (
                    <>
                        {communityPosts.length === 0 ? (
                            <div style={{textAlign: 'center', padding: '40px', color: 'var(--secondary)'}}>
                                No posts yet in this community. Be the first!
                            </div>
                        ) : (
                            <>
                                {communityPosts.map(post => <PostCard key={post.id} {...post} />)}
                                <div ref={loadMoreRef} style={{height:'20px', margin:'20px 0'}}>
                                    {loadingPosts && <div style={{textAlign:'center', color:'var(--secondary)', display:'flex', justifyContent:'center'}}><Spinner /></div>}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
         </div>

         {/* Right Sidebar */}
         <div className={styles.sidebar}>
             <div className={styles.trendingCard}>
                <h3 className={styles.cardTitle}>About Community</h3>
                <p style={{color:'var(--secondary)', lineHeight:'1.5'}}>{community.description}</p>
                <div style={{marginTop:'16px', display:'flex', gap:'8px', alignItems:'center', color:'var(--secondary)'}}>
                     {/* Redundant Member count but sidebar usually has it too */}
                    <span style={{fontWeight:'700', color:'var(--foreground)'}}>{community.memberCount || 0}</span> {community.memberCount === 1 ? 'Member' : 'Members'}
                </div>
                
                <div style={{marginTop: '20px'}}>
                    {community.isJoined ? (
                        <button 
                            className={styles.createBtn} 
                            style={{width:'100%', padding:'12px'}}
                            onClick={() => leaveCommunity(community.id)}
                        >
                            Joined
                        </button>
                    ) : (
                        <button 
                            className={styles.createBtn} 
                            style={{width:'100%', background:'var(--primary)', color:'white', border:'none', padding:'12px'}} 
                            onClick={() => joinCommunity(community.id)}
                        >
                            Join Community
                        </button>
                    )}
                </div>
             </div>
         </div>
    </div>
  );
}
