'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/services/api';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const IS_LOGGED_IN_KEY = 'studyspotify_is_logged_in';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        // Optimization: Don't check server if we know we aren't logged in
        const isLoggedIn = localStorage.getItem(IS_LOGGED_IN_KEY);

        // Explicitly check for the string 'true'
        if (isLoggedIn !== 'true') {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const { data } = await auth.getMe();
            setUser(data);
            // Ensure key is set if successful
            localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
        } catch (error) {
            // Not logged in or session expired
            console.warn("Session expired or invalid:", error);
            setUser(null);
            localStorage.removeItem(IS_LOGGED_IN_KEY);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        await auth.login(credentials);
        localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
        return checkUser();
    };

    const register = async (userData) => {
        // Register typically doesn't auto-login in this flow, usually redirects to login
        return auth.register(userData);
    };

    const logout = async () => {
        try {
            await auth.logout();
        } catch (e) {
            console.error('Logout failed', e);
        }
        setUser(null);
        localStorage.removeItem(IS_LOGGED_IN_KEY);
        router.push('/login');
    };

    const requestPasswordReset = (email) => auth.requestPasswordReset(email);
    const verifyResetCode = (data) => auth.verifyResetCode(data);
    const resetPassword = (data) => auth.resetPassword(data);
    const changePassword = (data) => auth.changePassword(data);

    const updateUser = async (data) => {
        const response = await auth.updateProfile(data);
        // Backend returns updated user object
        const updatedUser = response.data || response;
        setUser(prev => ({ ...prev, ...updatedUser }));
        return updatedUser;
    };

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
