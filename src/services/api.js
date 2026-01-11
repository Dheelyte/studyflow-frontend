export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Internal state for robust refresh logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

async function apiFetch(endpoint, options = {}) {
    const { headers, ...rest } = options;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        ...rest,
    };

    // Auto-include credentials (cookies)
    config.credentials = 'include';

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, config);
    } catch (error) {
        if (error.message === 'Failed to fetch') {
            throw new Error('An error occurred, please try again');
        }
        throw error;
    }
    if (!response.ok) {
        // Handle common errors like 401
        if (response.status === 401) {
            // Don't attempt to refresh if the error comes from login or register endpoints
            if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
                // Try to get a more specific error message if possible
                let errorMessage = 'Invalid credentials';
                try {
                    const errorData = await response.json();
                    if (errorData.detail) errorMessage = errorData.detail;
                } catch (e) { /* ignore */ }
                throw new Error(errorMessage);
            }
            const { _retry } = options;
            
            // If this is already a retry, just fail to prevent infinite loops
            if (_retry) {
                 console.warn("Unauthorized access (retry failed)");
                 if (window.location.pathname !== '/login') { /* window.location.href = '/login'; */ }
                 throw new Error('Session expired');
            }

            if (isRefreshing) {
                // If refresh is in progress, queue this request
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(() => {
                    // When resolved, retry the original request
                    return apiFetch(endpoint, { ...options, _retry: true });
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            options._retry = true;
            isRefreshing = true;

            try {
                console.log("Token expired, attempting refresh via /refresh...");
                // Call refresh endpoint. We pass _retry=true so if THIS fails with 401, it goes to the immediate fail block above.
                // User requested strictly /auth/refresh
                await apiFetch('/auth/refresh', { 
                    method: 'POST', 
                    // Ensure we don't infinitely retry the refresh call itself
                    _retry: true 
                });
                
                // On success, process queue and retry current request
                processQueue(null);
                isRefreshing = false;
                // Retry current request with updated credentials (cookies handled by browser)
                return apiFetch(endpoint, { ...options, _retry: true });

            } catch (refreshErr) {
                console.error("Session refresh failed", refreshErr);
                processQueue(refreshErr, null);
                isRefreshing = false;
                // Redirect because refresh failed, meaning user is not logged in / session invalid
                if (window.location.pathname !== '/login') { /* window.location.href = '/login'; */ } 
                throw new Error('Session expired');
            }
        }

        // Handle other errors (400, 422, 500 etc)
        let errorData = null;
        try {
            errorData = await response.json();
        } catch (e) {
            // Failed to parse JSON, fall back to status text
        }

        const errorMessage = errorData?.detail || `API Error: (${response.status}) ${response.statusText}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = errorData;

        // Attach validation errors specifically if present (usually 422)
        if (response.status === 422) {
             error.validationErrors = errorData;
        } else if (errorData?.errors) {
            error.validationErrors = errorData.errors;
        }

        throw error;
    }

    // safe parsing
    try {
        return await response.json();
    } catch {
        return null; // For 204 No Content
    }
}

export const auth = {
    login: (email, password) => apiFetch('/auth/login', {
        method: 'POST',
        // Default apiFetch header is application/json
        body: JSON.stringify({ email, password }),
    }),
    register: (data) => apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    logout: () => apiFetch('/auth/logout', { method: 'POST' }),
    me: () => apiFetch('/users/me'),
    updateProfile: (data) => apiFetch('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    requestPasswordReset: (email) => apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
    }),
    verifyResetCode: (data) => apiFetch('/auth/verify-reset-code', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    resetPassword: (data) => apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    changePassword: (data) => apiFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

export const users = {
    getMyActivity: () => apiFetch('/users/my-activity'),
};

export const communities = {
    list: (params) => {
        return apiFetch(`/communities`);
    },
    getMyCommunities: () => apiFetch('/communities/my-communities'),
    getExplore: () => apiFetch('/communities/explore'),
    get: (id) => apiFetch(`/communities/${id}`),
    create: (data) => apiFetch('/communities', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    update: (id, data) => apiFetch(`/communities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id) => apiFetch(`/communities/${id}`, {
        method: 'DELETE',
    }),
    join: (id) => apiFetch(`/communities/${id}/join`, {
        method: 'POST',
    }),
    leave: (id) => apiFetch(`/communities/${id}/leave`, {
        method: 'POST',
    }),
};

export const posts = {
    create: (data) => apiFetch('/posts/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    list: (communityId, params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/posts/${communityId}/posts?${searchParams.toString()}`);
    },
    getFeed: (params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/posts/feed?${searchParams.toString()}`);
    },
    getExploreFeed: (params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/posts/explore?${searchParams.toString()}`);
    },
    get: (id) => apiFetch(`/posts/${id}`),
    update: (id, data) => apiFetch(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id) => apiFetch(`/posts/${id}`, {
        method: 'DELETE',
    }),
    like: (id) => apiFetch(`/posts/${id}/like`, { method: 'POST' }),
    unlike: (id) => apiFetch(`/posts/${id}/like`, { method: 'DELETE' }),
};

export const comments = {
    create: (data) => apiFetch('/comments/', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    list: (postId, params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/comments/post/${postId}?${searchParams.toString()}`);
    },
    update: (id, data) => apiFetch(`/comments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    delete: (id) => apiFetch(`/comments/${id}`, {
        method: 'DELETE',
    }),
};

export const curriculum = {
    generate: (params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch("/generate-curriculum?" + searchParams.toString());
    },
    get: (id) => apiFetch(`/playlists/${id}`),
    getMyPlaylists: () => apiFetch('/playlists'),
    completeResource: (resourceId) => apiFetch(`/resource/${resourceId}/complete`, {
        method: 'POST'
    }),
    createPlaylist: (data) => apiFetch('/playlists', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getQuiz: (moduleId, params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/modules/${moduleId}/quiz?${searchParams.toString()}`);
    },
    submitQuiz: (moduleId, payload) => {
        console.log('Submitting Quiz Payload:', JSON.stringify(payload));
        return apiFetch(`/modules/${moduleId}/quiz/submit`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
};

export default { auth, users, communities, posts, comments, curriculum };
