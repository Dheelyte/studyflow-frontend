import re

file_path = '/home/delight/.gemini/antigravity/brain/2531a02e-8448-4b57-8417-1f02430ce51d/studyspotify/src/components/CommunityContext.js'

with open(file_path, 'r') as f:
    content = f.read()

# Define the old function to replace
target_block = r"""  // Memoized fetch logic
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
  }, []);"""

# Define the new function
replacement_block = r"""  // Memoized fetch logic
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
                time: new Date(p.created_at).toLocaleDateString(),
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
  }, []);"""

if target_block in content:
    new_content = content.replace(target_block, replacement_block)
    with open(file_path, 'w') as f:
        f.write(new_content)
    print("Patch applied successfully.")
else:
    # Try normalized replacement (ignoring whitespace differences slightly)
    # For now, let's just error if exact match fails
    print("Error: Target block not found in file.")
    # Debug print first 100 chars of target and content location relevant
    print(f"Target start: {target_block[:50]}")
    
