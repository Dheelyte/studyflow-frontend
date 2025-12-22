"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { communities as communityApi, posts as postApi, auth as authApi } from '@/services/api';
import { useRouter } from 'next/navigation';

const CommunityContext = createContext();

export function CommunityProvider({ children }) {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Auth State
  const router = useRouter();

  // Pagination Refs
  const pageState = useRef({
      skip: 0,
      hasMore: true,
      loading: false,
      type: 'feed', // 'feed' | 'community' | 'explore'
      id: null
  });
  
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  // Memoized fetch logic
  const fetchPosts = useCallback(async (type, id = null, reset = false) => {
      const state = pageState.current;
      
      if (!reset && (state.loading || !state.hasMore)) return;
      
      state.loading = true;
      setIsFetchingPosts(true); 
      
      if (reset) {
          state.skip = 0;
          state.hasMore = true;
          state.type = type;
          state.id = id;
          setPosts([]); 
      }
      
      try {
          const limit = 10;
          let res;
          
          if (type === 'feed') {
              res = await postApi.getFeed({ skip: state.skip, limit });
          } else if (type === 'explore') {
              res = await postApi.getExploreFeed({ skip: state.skip, limit });
          } else if (type === 'community') {
              res = await postApi.list(id, { skip: state.skip, limit });
          }
          
          // Helper to safely format user logic if missing
          const processed = (res || []).map(p => ({
                ...p,
                author: "User", 
                initials: "U",
                time: new Date(p.created_at).toLocaleDateString(),
                tag: "General",
                likes: 0,
                comments: [], 
                commentsCount: p.comments_count || 0
          }));
          
          setPosts(prev => reset ? processed : [...prev, ...processed]);
          
          state.skip += limit;
          state.hasMore = (res || []).length === limit;
          
      } catch (e) {
          console.error("Fetch posts failed", e);
      } finally {
          state.loading = false;
          setIsFetchingPosts(false);
      }
  }, []);

  // Stable wrappers
  const fetchUserFeed = useCallback((reset = false) => fetchPosts('feed', null, reset), [fetchPosts]);
  const fetchExploreFeed = useCallback((reset = false) => fetchPosts('explore', null, reset), [fetchPosts]);
  const fetchCommunityPosts = useCallback((id) => fetchPosts('community', id, true), [fetchPosts]);
  const loadMorePosts = useCallback(() => fetchPosts(pageState.current.type, pageState.current.id, false), [fetchPosts]);

  // Auth Helper
  const requireAuth = (action) => {
      if (!user) {
          router.push('/login');
          return;
      }
      action();
  };

  const fetchData = useCallback(async () => {
    try {
        setLoading(true);
        
        // Check Auth First
        let currentUser = null;
        try {
            currentUser = await authApi.me();
            setUser(currentUser);
        } catch (e) {
            // Not logged in or error
            setUser(null);
        }

        const promises = [];
        
        // Determine which community list to fetch based on auth
        if (currentUser) {
            // Authenticated: fetch Explore recommended + My Communities
             promises.push(communityApi.getExplore().catch(e => []));
             promises.push(communityApi.getMyCommunities().catch(e => []));
        } else {
             // Unauthenticated: fetch All Communities list
             promises.push(communityApi.list().catch(e => []));
        }

        const results = await Promise.all(promises);
        
        if (currentUser) {
            const [exploreRes, myRes] = results;
            
            const exploreMapped = (exploreRes || []).map(c => ({
                ...c,
                isJoined: false, 
                memberCount: c.member_count || 0,
                tags: c.tags || []
            }));

            const myMapped = (myRes || []).map(c => ({
                ...c,
                isJoined: true, 
                memberCount: c.member_count || 0, 
                tags: c.tags || []
            }));

            setCommunities([...myMapped, ...exploreMapped]);
        } else {
            // Unauthenticated - just one list (mapped as not joined)
            const allRes = results[0];
            const allMapped = (allRes || []).map(c => ({
                ...c,
                isJoined: false,
                memberCount: c.member_count || 0,
                tags: c.tags || []
            }));
            setCommunities(allMapped);
        }

    } catch (err) {
        console.error("Failed to load community data", err);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const joinCommunity = async (id) => {
    requireAuth(async () => {
        try {
            await communityApi.join(id);
            setCommunities(prev => prev.map(c => 
                c.id === id ? { ...c, isJoined: true, memberCount: (c.memberCount || 0) + 1 } : c
            ));
        } catch (e) {
            console.error("Failed to join community", e);
        }
    });
  };

  const leaveCommunity = async (id) => {
    requireAuth(async () => {
        try {
            await communityApi.leave(id);
            setCommunities(prev => prev.map(c => 
                c.id === id ? { ...c, isJoined: false, memberCount: Math.max(0, (c.memberCount || 0) - 1) } : c
            ));
        } catch (e) {
            console.error("Failed to leave community", e);
        }
    });
  };

  const createCommunity = async ({ name, description, tags }) => {
    if (!user) {
        router.push('/login');
        throw new Error("Login required");
    }
    
    try {
        const res = await communityApi.create({ name, description });
        const newCommunity = {
            ...res,
            memberCount: 0, 
            isJoined: false,
            tags: tags ? tags.split(',').map(t => t.trim()) : []
        };
        setCommunities([...communities, newCommunity]);
        return newCommunity.id;
    } catch (e) {
        console.error("Failed to create community", e);
        throw e;
    }
  };

  const createPost = async (content, communityId) => {
     if (!user) { router.push('/login'); return; }
     
     try {
        const res = await postApi.create({ 
            content, 
            community_id: parseInt(communityId) 
        });
        
        const newPost = {
            ...res,
            author: "You",
            initials: "ME",
            time: "Just now",
            tag: "General",
            likes: 0,
            comments: [],
            commentsCount: 0
        };
        setPosts([newPost, ...posts]);
     } catch (e) {
         console.error("Create post failed", e);
         alert("Failed to create post");
     }
  };

  const getCommunity = (id) => communities.find(c => c.id == id);
  
  const fetchCommunityDetails = useCallback(async (id) => {
      try {
          const detail = await communityApi.get(id);
          if (detail) {
               setCommunities(prev => {
                   const exists = prev.find(c => c.id == id);
                   if (exists) {
                       return prev.map(c => c.id == id ? { ...c, ...detail, memberCount: detail.member_count, isJoined: detail.is_member } : c);
                   } else {
                        return [...prev, { ...detail, memberCount: detail.member_count, isJoined: detail.is_member }];
                   }
               });
               return detail;
          }
      } catch (e) {
          console.error("Failed to fetch community details", e);
      }
      return null;
  }, []);

  return (
    <CommunityContext.Provider value={{ 
        communities, 
        posts, 
        user,  // Expose User
        joinCommunity, 
        leaveCommunity, 
        createCommunity,
        createPost,
        getCommunity,
        fetchCommunityDetails,
        fetchUserFeed,       
        fetchExploreFeed,    
        fetchCommunityPosts, 
        loadMorePosts,       
        requireAuth,         
        loading,
        loadingPosts: isFetchingPosts,
        hasMorePosts: () => pageState.current.hasMore
    }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity() {
  return useContext(CommunityContext);
}
