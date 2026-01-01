"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';
import { HomeIcon, LibraryIcon, UserIcon, UsersIcon } from './Icons';

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/' || path === '/dashboard') {
             return pathname === '/' || pathname === '/dashboard';
        }
        return pathname.startsWith(path);
    };

    return (
        <nav className={styles.bottomNav}>
            <Link href="/dashboard" className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
                <HomeIcon size={24} />
                <span>Home</span>
            </Link>
            
            <Link href="/library" className={`${styles.navItem} ${isActive('/library') ? styles.active : ''}`}>
                <LibraryIcon size={24} />
                <span>Library</span>
            </Link>

            <Link href="/community" className={`${styles.navItem} ${isActive('/community') ? styles.active : ''}`}>
                <UsersIcon size={24} />
                <span>Community</span>
            </Link>

            <Link href="/profile" className={`${styles.navItem} ${isActive('/profile') ? styles.active : ''}`}>
                <UserIcon size={24} />
                <span>Profile</span>
            </Link>
        </nav>
    );
}
