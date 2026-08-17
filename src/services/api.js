export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// Internal state for robust refresh logic
let isRefreshing = false;
let failedQueue = [];

// Broadcast that the session is unrecoverable so AuthContext can drop the user.
// Routing stays with AuthGuard, which knows which paths actually need auth.
export const SESSION_EXPIRED_EVENT = 'primerly:session-expired';

const notifySessionExpired = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

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
                return new Promise(function (resolve, reject) {
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
                // Don't navigate from here: public pages (/, /pricing, /explore,
                // /course/*) make authenticated calls opportunistically, and a
                // hard redirect would eject a visitor who was never asked to log
                // in. Announce the dead session instead , AuthContext clears the
                // user and AuthGuard sends them to /login only on protected paths.
                notifySessionExpired();
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

export const screenTutor = {
    getStatus: () => apiFetch('/screen-tutor/status'),
    // Lessons and already-generated projects the tutor can be pinned to.
    getPinTargets: (courseRef) => apiFetch(`/playlists/${courseRef}/tutor-targets`),
    // Streams newline-delimited JSON events: status | chunk | done | error.
    // The frame is forwarded to the model and never stored server-side.
    ask: async function* (payload) {
        const response = await fetch(`${API_URL}/screen-tutor/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload),
        });
        if (!response.ok || !response.body) {
            let errMsg = `Screen tutor request failed (${response.status})`;
            let errData = null;
            try {
                errData = await response.json();
                if (errData?.detail) errMsg = typeof errData.detail === 'string' ? errData.detail : errMsg;
            } catch (e) { /* ignore */ }
            const error = new Error(errMsg);
            error.status = response.status;
            error.data = errData;
            throw error;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let nl;
            while ((nl = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, nl).trim();
                buffer = buffer.slice(nl + 1);
                if (!line) continue;
                try {
                    yield JSON.parse(line);
                } catch (e) {
                    console.error('Bad stream chunk:', line, e);
                }
            }
        }
        const tail = buffer.trim();
        if (tail) {
            try { yield JSON.parse(tail); } catch (e) { /* ignore */ }
        }
    },
};

export const projects = {
    // Briefs are generated on first request, so these can take a few seconds.
    getCapstone: (courseRef) => apiFetch(`/playlists/${courseRef}/project`),
    getModuleProject: (moduleId) => apiFetch(`/modules/${moduleId}/project`),
    updateProgress: (projectId, data) => apiFetch(`/projects/${projectId}/progress`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    }),
};

export const gallery = {
    list: ({ limit = 24, offset = 0, featured = false, q = '' } = {}) => {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
            featured: String(featured),
        });
        if (q && q.trim().length >= 2) params.set('q', q.trim());
        return apiFetch(`/gallery?${params.toString()}`);
    },
    get: (slug) => apiFetch(`/gallery/${encodeURIComponent(slug)}`),
    enroll: (slug) => apiFetch(`/gallery/${encodeURIComponent(slug)}/enroll`, {
        method: 'POST',
    }),
    setPublishState: (playlistId, isPublic) => apiFetch(`/playlists/${playlistId}/publish`, {
        method: 'POST',
        body: JSON.stringify({ is_public: isPublic }),
    }),
};

export const billing = {
    status: () => apiFetch('/billing/status'),
    checkout: (tier, interval) => apiFetch('/billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ tier, interval }),
    }),
    verify: (reference) => apiFetch(`/billing/verify?reference=${encodeURIComponent(reference)}`),
    cancel: () => apiFetch('/billing/cancel', { method: 'POST' }),
};

export const curriculum = {
    generate: (params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch("/generate-curriculum?" + searchParams.toString());
    },
    getCourse: (id) => apiFetch(`/playlists/${id}`),
    getMyCourses: () => apiFetch('/playlists'),
    completeTopic: (topicId) => apiFetch(`/topics/${topicId}/complete`, {
        method: 'POST'
    }),
    createCourse: (data) => apiFetch('/playlists', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getTopicVideo: (topicId) => apiFetch(`/topics/${topicId}/video`),
    explainTopic: (topicId, data) => apiFetch(`/topics/${topicId}/explain`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getChatSession: (topicId) => apiFetch(`/topics/${topicId}/chat`),
    getChatMessagesPage: (topicId, { beforeId, limit = 50 } = {}) => {
        const params = new URLSearchParams();
        if (beforeId != null) params.set('before_id', beforeId);
        params.set('limit', limit);
        return apiFetch(`/topics/${topicId}/chat/messages?${params.toString()}`);
    },
    sendChatMessage: (topicId, data) => apiFetch(`/topics/${topicId}/chat/messages`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    streamChatMessage: async function* (topicId, data) {
        const response = await fetch(
            `${API_URL}/topics/${topicId}/chat/messages/stream`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data),
            }
        );
        if (!response.ok || !response.body) {
            let errMsg = `Stream request failed (${response.status})`;
            let errData = null;
            try {
                errData = await response.json();
                if (errData?.detail) errMsg = errData.detail;
            } catch (e) { /* ignore */ }
            const error = new Error(errMsg);
            error.status = response.status;
            error.data = errData;
            throw error;
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let nl;
            while ((nl = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, nl).trim();
                buffer = buffer.slice(nl + 1);
                if (!line) continue;
                try {
                    yield JSON.parse(line);
                } catch (e) {
                    console.error('Bad stream chunk:', line, e);
                }
            }
        }
        const tail = buffer.trim();
        if (tail) {
            try { yield JSON.parse(tail); } catch (e) { /* ignore */ }
        }
    },
    clearChatSession: (topicId) => apiFetch(`/topics/${topicId}/chat`, {
        method: 'DELETE'
    }),
    // Spoken question -> text for the chat composer. The recording is forwarded
    // to the model and never stored.
    transcribeQuestion: (audioDataUrl) => apiFetch('/chat/transcribe', {
        method: 'POST',
        body: JSON.stringify({ audio: audioDataUrl }),
    }),
    getCertificateStatus: (playlistId) =>
        apiFetch(`/playlists/${playlistId}/certificate`),
    issueCertificate: (playlistId) =>
        apiFetch(`/playlists/${playlistId}/certificate`, { method: 'POST' }),
    listMyCertificates: () => apiFetch(`/me/certificates`),
    verifyCertificate: (code) => apiFetch(`/certificates/${code}`),
    getQuiz: (moduleId, params) => {
        const searchParams = new URLSearchParams(params);
        return apiFetch(`/modules/${moduleId}/quiz?${searchParams.toString()}`);
    },
    submitQuiz: (moduleId, payload) => {
        return apiFetch(`/modules/${moduleId}/quiz/submit`, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
};

export default { auth, users, communities, posts, comments, curriculum };
