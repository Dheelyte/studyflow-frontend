"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { communities as communityApi, posts as postApi, auth as authApi } from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { formatTimeAgo } from '@/utils/dateUtils';

const CommunityContext = createContext();

export function CommunityProvider({ children }) {
  const [communities, setCommunities] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Use centralized Auth state
  const router = useRouter();
  const pathname = usePathname();

  // Track the latest fetch ID to prevent race conditions
  const fetchIdRef = useRef(0);

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
  const postsFetchIdRef = useRef(0);

  const fetchPosts = useCallback(async (type, id = null, reset = false) => {
      const state = pageState.current;
      
      // Prevent concurrent loads unless resetting (which force-restarts)
      if (!reset && (state.loading || !state.hasMore)) return;
      
      const currentId = ++postsFetchIdRef.current;
      
      state.loading = true;
      setIsFetchingPosts(true); 
      
      if (reset) {
          state.skip = 0;
          state.hasMore = true;
          state.type = type;
          state.id = id;
          // Optimistically clear posts? Maybe better to wait for data to prevent flash
          // setPosts([]); 
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

          // Race condition check: if a new request started, ignore this one
          if (currentId !== postsFetchIdRef.current) return;
          
          // Helper to safely format user logic if missing
          const processed = (res || []).map(p => ({
                ...p,
                author: "User", 
                initials: "U",
                time: formatTimeAgo(p.created_at),
                tag: "General",
                likes: 0,
                comments: [], 
                commentsCount: p.comments_count || 0
          }));
          
          setPosts(prev => reset ? processed : [...prev, ...processed]);
          
          // Correctly set skip based on CURRENT fetch, not purely incremental
          if (reset) {
              state.skip = limit;
          } else {
              state.skip += limit;
          }
          
          state.hasMore = (res || []).length === limit;
          
      } catch (e) {
          if (currentId === postsFetchIdRef.current) {
               console.error("Fetch posts failed", e);
          }
      } finally {
          if (currentId === postsFetchIdRef.current) {
              state.loading = false;
              setIsFetchingPosts(false);
          }
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
        if (typeof window !== 'undefined' && (
        pathname === '/' || 
        pathname.startsWith('/playlist/') || 
        pathname === '/profile' || 
        pathname.startsWith('/library') || 
        pathname === '/login' || 
        pathname === '/signup' || 
        pathname.startsWith('/curriculum') ||
        pathname === '/about' ||
        pathname === '/contact' ||
        pathname === '/privacy-policy' ||
        pathname === '/terms-of-service' ||
        pathname === '/cookie-policy'
    )) {
        setLoading(false);
        return;
    }
    // Increment ID to mark start of new fetch
    const currentFetchId = ++fetchIdRef.current;
    
    try {
        setLoading(true);
        
        // Use the user from closure/prop (AuthContext)
        const currentUser = user;

        const promises = [];
        
        // Determine which community list to fetch based on auth
        if (currentUser) {
            // Authenticated: ONLY fetch My Communities for the Sidebar
             promises.push(communityApi.getMyCommunities().catch(e => []));
        } else {
             // Unauthenticated: fetch All Communities list
             promises.push(communityApi.list().catch(e => []));
        }

        const results = await Promise.all(promises);
        
        // If a newer fetch started, abandon this one
        if (currentFetchId !== fetchIdRef.current) return;
        
        // Process new data
        let newCommunities = [];
        
        if (currentUser) {
            const [myRes] = results;
            
            // We only have My Communities now
            const myMapped = (myRes || []).map(c => ({
                ...c,
                isJoined: true, 
                memberCount: c.member_count || 0, 
                tags: c.tags || []
            }));

            newCommunities = [...myMapped];
        } else {
            // Unauthenticated - just one list (mapped as not joined)
            const allRes = results[0];
            newCommunities = (allRes || []).map(c => ({
                ...c,
                isJoined: false,
                memberCount: c.member_count || 0,
                tags: c.tags || []
            }));
        }

        console.log("fetchData new communities:", newCommunities);

        setCommunities(prev => {
            const newMap = new Map(newCommunities.map(c => [c.id, c]));
            
            // 1. Update existing items in 'prev'
            const updatedPrev = prev.map(existing => {
                const match = newMap.get(existing.id);
                if (match) {
                    // Update existing with new data
                    const useExistingCount = (match.memberCount === 0 && existing.memberCount > 0);
                    return {
                        ...existing,
                        ...match,
                        memberCount: useExistingCount ? existing.memberCount : match.memberCount,
                        // If newCommunities is MyCommunities, and match found, isJoined must be true (usually)
                        // But let's trust match.isJoined
                    };
                }
                // If not in new list, KEEP it
                // (e.g. an Explore community we are viewing details for)
                return existing;
            });
            
            // 2. Find fully new items in 'newCommunities' that weren't in 'prev'
            const prevIds = new Set(prev.map(c => c.id));
            const brandNew = newCommunities.filter(nc => !prevIds.has(nc.id));
            
            return [...updatedPrev, ...brandNew];
        });

    } catch (err) {
        if (currentFetchId === fetchIdRef.current) {
             console.error("Failed to load community data", err);
        }
    } finally {
        if (currentFetchId === fetchIdRef.current) {
            setLoading(false);
        }
    }
  }, [user, pathname]);
  // Trigger initial fetch
  useEffect(() => {
      fetchData();
  }, [fetchData]);



  const fetchExploreCommunities = useCallback(async () => {
    // Only needed if we want to fill the "Explore" list for authenticated users
    if (!user) return; 

    try {
        const exploreRes = await communityApi.getExplore();
        const exploreMapped = (exploreRes || []).map(c => ({
            ...c,
            isJoined: false, 
            memberCount: c.member_count || 0,
            tags: c.tags || []
        }));
        
        setCommunities(prev => {
             // Merge avoids duplicates
            const existingIds = new Set(prev.map(c => c.id));
            const distinctNew = exploreMapped.filter(c => !existingIds.has(c.id));
            return [...prev, ...distinctNew];
        });
    } catch (e) {
        console.error("Failed to fetch explore communities", e);
    }
  }, [user]);

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
               console.log("Fetched detail:", detail);
               const count = detail.member_count ?? detail.memberCount;
               
               setCommunities(prev => {
                   const exists = prev.find(c => c.id == id);
                   const safeCount = count !== undefined ? count : (exists ? exists.memberCount : 0);
                   
                   if (exists) {
                       return prev.map(c => c.id == id ? { ...c, ...detail, memberCount: safeCount, isJoined: detail.is_member } : c);
                   } else {
                        return [...prev, { ...detail, memberCount: safeCount, isJoined: detail.is_member }];
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
        fetchInitialData: fetchData, 
        posts, 
        user,  // Expose User from AuthContext
        joinCommunity, 
        leaveCommunity, 
        createCommunity,
        createPost,
        getCommunity,
        fetchCommunityDetails,
        fetchExploreCommunities,
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
