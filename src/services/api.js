const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Handle API responses and throw errors for non-200 status codes.
 * @param {Response} response
 */
async function handleResponse(response) {
  if (response.status === 204) return null;
  
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  
  if (!response.ok) {
    const error = new Error(data.detail || data.message || 'API Error');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
}

/**
 * Generic fetch wrapper with default headers and credentials (cookies).
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Important for sending/receiving HTTP-only cookies
    credentials: 'include', 
  };

  const response = await fetch(url, config);
  return handleResponse(response);
}

// Authentication
export const auth = {
  register: (userData) => apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  logout: () => apiFetch('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({}), 
  }),
  
  getMe: () => apiFetch('/users/me'),
  
  requestPasswordReset: (email) => apiFetch('/auth/request-password-reset', {
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

  changePassword: (data) => apiFetch('/users/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateProfile: (data) => apiFetch('/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

export default {
  auth,
};
