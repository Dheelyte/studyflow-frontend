'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

import LoadingLogo from './LoadingLogo';

const PROTECTED_PATHS = ['/dashboard', '/library', '/profile'];

export default function AuthGuard({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
             const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
             if (!user && isProtectedPath) {
                 router.push('/login');
             }
        }
    }, [user, loading, pathname, router]);

    if (loading) {
        return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--foreground)'}}><LoadingLogo size={48} /></div>;
    }

    const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
    if (!user && isProtectedPath) {
        return null; 
    }

    return children;
}
