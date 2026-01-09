"use client";
import React, { useState, useEffect } from 'react';
import { HeartIcon, MessageSquareIcon } from './Icons';
import SimpleRichTextEditor from './SimpleRichTextEditor';
import { comments as commentApi, posts as postsApi } from '@/services/api';
import { useCommunity } from '@/components/CommunityContext';
import { formatTimeAgo } from '@/utils/dateUtils';

const COMMENT_LIMIT = 5;

const PASTEL_COLORS = [
    'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)', // Pink
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', // Purple
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', // Blue/Green
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)', // Orange/Purple
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)', // Light Purple/Blue
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Red/Pink
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green
];

function getColorForAuthor(author) {
    let hash = 0;
    for (let i = 0; i < author.length; i++) {
        hash = author.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PASTEL_COLORS.length;
    return PASTEL_COLORS[index];
}

export default function PostCard({ id, author, time, content, likes: initialLikesProp, likes_count, comments: initialComments, liked: initialLikedProp, liked_by_user, commentsCount: initialCount }) {
    const { requireAuth } = useCommunity(); // Use auth helper

    // Fallback for backward compatibility or different API shapes
    const initialLikes = likes_count !== undefined ? likes_count : initialLikesProp;
    const initialLiked = liked_by_user !== undefined ? liked_by_user : initialLikedProp;
    
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    
    const [comments, setComments] = useState(Array.isArray(initialComments) ? initialComments : []);
    const [showComments, setShowComments] = useState(false);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [hasMoreComments, setHasMoreComments] = useState(false);
    const [commentSkip, setCommentSkip] = useState(0);
    const [loadingComments, setLoadingComments] = useState(false);
    
    const [totalComments, setTotalComments] = useState(initialCount || (initialComments ? initialComments.length : 0));
    
    useEffect(() => {
        if (typeof initialCount === 'number') {
            setTotalComments(initialCount);
        }
    }, [initialCount]);

    const [newComment, setNewComment] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const MAX_LENGTH = 280;

    const shouldTruncate = content && content.length > MAX_LENGTH;
    const displayContent = shouldTruncate && !isExpanded 
        ? content.slice(0, MAX_LENGTH) + '...' 
        : content;


    const toggleLike = () => {
        requireAuth(async () => {
            const originalLikes = likes;
            const originalLiked = liked;
            if (liked) {
                setLikes(likes - 1);
                setLiked(false);
                try { await postsApi.unlike(id); } catch(e) { console.error('Failed to unlike', e); setLikes(originalLikes); setLiked(originalLiked); }
            } else {
                setLikes(likes + 1);
                setLiked(true);
                try { await postsApi.like(id); } catch(e) { console.error('Failed to like', e); setLikes(originalLikes); setLiked(originalLiked); }
            }
        });
    };

    const fetchComments = async (skip = 0) => {
        try {
            setLoadingComments(true);
            const res = await commentApi.list(id, { skip, limit: COMMENT_LIMIT });
            if (res) {
                const mapped = res.map(c => ({
                    id: c.id,
                    author: c.user?.email ? c.user.email.split('@')[0] : 'User',
                    content: c.content,
                    time: formatTimeAgo(c.created_at)
                }));
                
                if (skip === 0) {
                    setComments(mapped);
                } else {
                    setComments(prev => [...prev, ...mapped]);
                }
                
                setHasMoreComments(res.length === COMMENT_LIMIT);
                setCommentSkip(skip + COMMENT_LIMIT);
                setCommentsLoaded(true);
            }
        } catch (e) {
            console.error("Failed to load comments", e);
        } finally {
            setLoadingComments(false);
        }
    };

    const toggleComments = async () => {
        // Comments are visible to all (read-only), but posting requires auth.
        // Or do we require auth to even view? "If any authenticated button or link is clicked...".
        // Usually viewing comments is fine. Posting is restricted.
        // Let's allow view, restrict reply.
        
        const nextState = !showComments;
        setShowComments(nextState);
        
        if (nextState && !commentsLoaded && id) {
            await fetchComments(0);
        }
    };

    const loadMoreComments = () => {
        fetchComments(commentSkip);
    };

    const handleCommentSubmit = async () => {
        requireAuth(async () => {
            if (!newComment.trim()) return;
            
            try {
                const res = await commentApi.create({
                    content: newComment,
                    post_id: id
                });
                
                if (res) {
                    const commentObj = {
                        id: res.id,
                        author: res.user?.email ? res.user.email.split('@')[0] : 'You', 
                        content: res.content,
                        time: 'Just now'
                    };
                    
                    if (!res.user && !commentObj.author) commentObj.author = 'You';

                    setComments([...comments, commentObj]);
                    setTotalComments(prev => prev + 1);
                    setNewComment('');
                }
            } catch (e) {
                console.error("Failed to post comment", e);
                alert("Failed to post comment");
            }
        });
    };


    const renderContent = (text) => {
        if (!text) return null;
        const parts = text.split(/(```[\s\S]*?```)/g);
        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const codeContent = part.replace(/^```/, '').replace(/```$/, '').trim();
                return (
                    <div key={index} style={{marginTop: '12px', marginBottom: '12px', padding: '16px', borderRadius: '8px', background: '#1e1e1e', color: '#eee', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflowX: 'auto', fontSize: '0.9rem'}}>
                        {codeContent}
                    </div>
                );
            }
            if (!part) return null;
            return (
                <div key={index}>
                    {part.split('\n').map((line, lineIndex) => {
                        let html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:4px; font-family:monospace">$1</code>');
                        return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} style={{minHeight: html ? 'auto' : '1em'}} />;
                    })}
                </div>
            )
        });
    };

    return (
        <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '0px'
        }}>
           <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
               <div style={{
                   width:'40px', 
                   height:'40px', 
                   borderRadius:'50%', 
                   background: getColorForAuthor(author),
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   color: 'white',
                   fontWeight: 'bold',
                   fontSize: '0.9rem'
               }}>
                   {author ? author.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
               </div>
               <div>
                   <div style={{fontWeight:'700'}}>{author}</div>
                   <div style={{fontSize:'0.8rem', color:'var(--secondary)'}}>{time}</div>
               </div>
           </div>

           <div style={{fontSize:'1rem', lineHeight:'1.6', marginBottom:'24px', color:'var(--foreground)'}}>
                {renderContent(displayContent)}
                {shouldTruncate && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--secondary)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            padding: '0',
                            marginTop: '8px',
                            fontSize: '0.9rem'
                        }}
                    >
                        {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                )}
           </div>

           <div style={{display:'flex', gap:'24px', borderTop:'1px solid var(--border)', paddingTop:'16px'}}>
               <button onClick={toggleLike} style={{display:'flex', gap:'8px', alignItems:'center', background:'none', border:'none', cursor:'pointer', color: liked ? '#ef4444' : 'var(--secondary)'}}>
                   <HeartIcon size={20} fill={liked ? '#ef4444' : 'none'} />
                   <span>{likes}</span>
               </button>
               <button onClick={toggleComments} style={{display:'flex', gap:'8px', alignItems:'center', background:'none', border:'none', cursor:'pointer', color:'var(--secondary)'}}>
                   <MessageSquareIcon size={20} />
                   <span>{totalComments}</span>
               </button>
           </div>

           {showComments && (
               <div style={{marginTop:'24px', paddingTop:'24px', borderTop:'1px solid var(--border)'}}>
                   {comments.map(c => (
                       <div key={c.id} style={{marginBottom:'16px', paddingLeft:'16px', borderLeft:'2px solid var(--border)'}}>
                           <div style={{fontSize:'0.85rem', fontWeight:'700', marginBottom:'4px'}}>{c.author} <span style={{fontWeight:'400', color:'var(--secondary)'}}>• {c.time}</span></div>
                           <div style={{fontSize:'0.9rem', color:'var(--foreground)'}}>{renderContent(c.content)}</div>
                       </div>
                   ))}
                   
                   {loadingComments && (
                       <div style={{fontSize:'0.9rem', color:'var(--secondary)', textAlign:'center', marginBottom:'16px'}}>Loading comments...</div>
                   )}

                   {!loadingComments && hasMoreComments && (
                       <button onClick={loadMoreComments} style={{width:'100%', padding:'8px', background:'transparent', border:'1px dashed var(--border)', color:'var(--secondary)', borderRadius:'8px', cursor:'pointer', marginBottom:'16px'}}>
                           Load older comments
                       </button>
                   )}

                   {comments.length === 0 && !loadingComments && (
                       <div style={{fontSize:'0.9rem', color:'var(--secondary)', fontStyle:'italic', marginBottom:'16px'}}>No comments yet.</div>
                   )}
                   
                   <div style={{marginTop:'24px'}}>
                        <SimpleRichTextEditor 
                            value={newComment}
                            onChange={(val) => {
                                // optional: check auth on focus? 
                                // Better to check on submit or let them type but block sending.
                                // Or simply "Login to comment" placeholder.
                                setNewComment(val)
                            }}
                            placeholder="Write a comment..."
                            minHeight="80px"
                            // If we want to be strict, we could wrap the whole editor in a div and onCapture click requireAuth.
                        />
                        <div style={{display:'flex', justifyContent:'flex-end', marginTop:'8px'}}>
                             <button onClick={handleCommentSubmit} style={{
                                 background:'var(--primary)', color:'white', border:'none', borderRadius:'6px', padding:'6px 16px', fontSize:'0.9rem', cursor:'pointer'
                             }}>
                                 Reply
                             </button>
                        </div>
                   </div>
               </div>
           )}
        </div>
    );
}
