'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

const PUBLIC_PATHS = ['/login', '/signup', '/curriculum', '/community'];

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    // derived state is risky if loading flashes, but effectively:
    
    useEffect(() => {
        if (!loading) {
             const isPublicPath = pathname === '/' || PUBLIC_PATHS.some(path => pathname.startsWith(path));
             if (!user && !isPublicPath) {
                 router.push('/login');
             }
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)'}}>Loading...</div>;
    }

    const isPublicPath = pathname === '/' || PUBLIC_PATHS.some(path => pathname.startsWith(path));
    if (!user && !isPublicPath) {
        return null; // Redirecting
    }

    return children;
}
