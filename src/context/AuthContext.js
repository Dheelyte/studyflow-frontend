'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth } from '@/services/api';
import { useRouter, usePathname } from 'next/navigation';

const AuthContext = createContext();

const IS_LOGGED_IN_KEY = 'studyspotify_is_logged_in';
const USER_DATA_KEY = 'studyspotify_user_data';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = useCallback(async (force = false) => {
        if (!force && typeof window !== 'undefined' && (pathname === '/' || pathname.startsWith('/playlist/') || pathname.startsWith('/library') || pathname.startsWith('/curriculum'))) {
            setLoading(false);
            return;
        }
        // Optimization: Don't check session if we know user isn't logged in locally
        if (!force && typeof window !== 'undefined' && !localStorage.getItem(IS_LOGGED_IN_KEY)) {
            setLoading(false);
            return;
        }

        try {
            // Always try to fetch the user. The backend (via cookies) is the source of truth.
            // If valid cookies exist, this will succeed (possibly triggering a refresh).
            const response = await auth.me();
            // Handle response structure depending on if apiFetch returns { data: user } or just user
            const userData = response.data || response;

            setUser(userData);
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
            localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
            return userData;
        } catch (error) {
            // Not logged in or session expired
            console.warn("Session check failed:", error);
            setUser(null);
            localStorage.removeItem(IS_LOGGED_IN_KEY);
            localStorage.removeItem(USER_DATA_KEY);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setUser, setLoading, pathname]);

    const login = useCallback(async (credentials) => {
        const { email, password } = credentials;
        await auth.login(email, password);
        localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
        return checkUser(true);
    }, [checkUser]);

    const register = useCallback(async (userData) => {
        // Register typically doesn't auto-login in this flow, usually redirects to login
        return auth.register(userData);
    }, []);

    const logout = useCallback(async () => {
        try {
            await auth.logout();
        } catch (e) {
            console.error('Logout failed', e);
        }
        setUser(null);
        localStorage.removeItem(IS_LOGGED_IN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
        router.push('/login');
    }, [router, setUser]);

    const requestPasswordReset = useCallback((email) => auth.requestPasswordReset(email), []);
    const verifyResetCode = useCallback((data) => auth.verifyResetCode(data), []);
    const resetPassword = useCallback((data) => auth.resetPassword(data), []);
    const changePassword = useCallback((data) => auth.changePassword(data), []);

    const updateUser = useCallback(async (data) => {
        const response = await auth.updateProfile(data);
        // Backend returns updated user object
        const updatedUser = response.data || response;
        setUser(prev => {
            const newUser = { ...prev, ...updatedUser };
            localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
            return newUser;
        });
        return updatedUser;
    }, [setUser]);

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        requestPasswordReset,
        verifyResetCode,
        resetPassword,
        changePassword,
        updateUser,
        checkUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
