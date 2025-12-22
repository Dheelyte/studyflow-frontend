"use client";
import React, { useEffect } from 'react';
import { useCommunity } from '@/components/CommunityContext';
import PostCard from '@/components/PostCard';
import CreatePost from '@/components/CreatePost';
import { ChevronLeft } from '@/components/Icons';
import Link from 'next/link';
import styles from '../page.module.css'; 

export default function CommunityDetail({ params }) {
    const { slug } = React.use(params);
    return <CommunityDetailContent slug={slug} />;
}

function CommunityDetailContent({ slug }) {
  const { getCommunity, posts, createPost, joinCommunity, leaveCommunity, fetchCommunityPosts, fetchCommunityDetails } = useCommunity();
  const community = getCommunity(slug);
  
  // Fetch posts AND details (for member count) when entering the community
  useEffect(() => {
      if (slug) {
         fetchCommunityPosts(slug);
         fetchCommunityDetails(slug);
      }
  }, [slug, fetchCommunityPosts, fetchCommunityDetails]);
  
  if (!community) {
      return (
        <div className={styles.page}>
            <div className={styles.mainColumn}>
                 <Link href="/community" className={styles.backBtn}>
                    <ChevronLeft size={16} /> Back to Hub
                </Link>
                <div style={{padding: 40, textAlign:'center'}}>
                    Loading community data... (ID: {slug})
                    <br/><br/>
                    <Link href="/community" style={{color:'var(--primary)'}}>Go back</Link>
                </div>
            </div>
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
                         <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <div>
                                <h1 className={styles.title}>{community.name}</h1>
                                <p className={styles.subtitle}>{community.description}</p>
                            </div>
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
                         <div style={{marginTop: '16px', display:'flex', gap:'8px'}}>
                             {/* Display Member Count Here */}
                             <span style={{fontSize:'0.9rem', fontWeight:'600', color:'var(--foreground)'}}>
                                {community.memberCount !== undefined ? community.memberCount : '...'} <span style={{fontWeight:'400', color:'var(--secondary)'}}>Members</span>
                             </span>
                             
                             <span style={{color:'var(--border)'}}>|</span>
                             
                             {community.tags && community.tags.map(t => (
                                 <span key={t} style={{fontSize:'0.8rem', background:'rgba(255,255,255,0.05)', padding:'4px 8px', borderRadius:'6px'}}>#{t}</span>
                             ))}
                         </div>
                     </div>
                 </div>
            </div>

            <CreatePost onPost={(data) => createPost(data, community.id)} />

            <div className={styles.feed}>
                {communityPosts.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '40px', color: 'var(--secondary)'}}>
                        No posts yet in this community. Be the first!
                    </div>
                ) : (
                    communityPosts.map(post => <PostCard key={post.id} {...post} />)
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
                    <span style={{fontWeight:'700', color:'var(--foreground)'}}>{community.memberCount || 0}</span> Members
                </div>
             </div>
         </div>
    </div>
  );
}
