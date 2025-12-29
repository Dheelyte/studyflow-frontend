const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

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

    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
        // Handle common errors like 401
        if (response.status === 401) {
            console.warn("Unauthorized access");
            // window.location.href = '/login'; // Optional: redirect
        }
        throw new Error(`API Error: ${response.statusText}`);
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
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/communities/?${searchParams.toString()}`);
    },
    getMyCommunities: () => apiFetch('/communities/my-communities'),
    getExplore: () => apiFetch('/communities/explore'),
    get: (id) => apiFetch(`/communities/${id}`),
    create: (data) => apiFetch('/communities/', {
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
};

export default { auth, users, communities, posts, comments, curriculum };
