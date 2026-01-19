"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { HomeIcon, LibraryIcon, ZapIcon, ChevronLeft, ChevronRight, XIcon, LaptopIcon, UserIcon, SunIcon, MoonIcon, UsersIcon } from './Icons';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isCollapsed, isOpen, onClose, onToggleCollapse, isMobile }) {
    const router = useRouter();
    const { user, logout } = useAuth();


    const handleNavClick = () => {
        if (isMobile && onClose) {
            onClose();
        }
    };

    const handleProtectedNav = (e) => {
        // Allow navigation if user is authenticated
        if (user) {
            handleNavClick();
            return;
        }

        // If unauthenticated, prevent default navigation and redirect to login
        e.preventDefault();
        router.push('/login');
        // Also close sidebar on mobile if needed
        if (isMobile && onClose) {
            onClose();
        }
    };

    const sidebarClasses = `${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isOpen ? styles.open : ''}`;

    return (
        <>
            {isMobile && isOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 990, backdropFilter: 'blur(4px)'
                    }}
                    onClick={onClose}
                />
            )}

            <aside className={sidebarClasses}>
                {isMobile && (
                    <button className={styles.closeMobileBtn} onClick={onClose}>
                        <XIcon size={24} />
                    </button>
                )}

                {!isMobile && (
                    <>
                        <button className={styles.toggleCollapseBtn} onClick={onToggleCollapse} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                        </button>


                    </>
                )}

                <nav className={styles.navContainer}>
                    <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
                        <ZapIcon size={28} fill="var(--primary)" /> <span>Primerly</span>
                    </Link>

                    <Link href="/dashboard" className={styles.navItem} onClick={handleProtectedNav}>
                        <HomeIcon />
                        <span>Home</span>
                    </Link>

                    {/* Library Link (Simplified) */}
                    <Link href="/library" className={styles.navItem} onClick={handleProtectedNav} title="Library">
                        <LibraryIcon />
                        <span>Library</span>
                    </Link>

                    {/* Community Link (Simplified) */}
                    <Link href="/community" className={styles.navItem} onClick={handleProtectedNav} title="Community">
                        <UsersIcon />
                        <span>Community</span>
                    </Link>

                    <Link href="/profile" className={styles.navItem} onClick={handleProtectedNav}>
                        <UserIcon />
                        <span>Profile</span>
                    </Link>

                </nav>

                <div className={styles.footer}>

                    {!user && (
                        <div className={styles.authButtons}>
                            <Link href="/login" className={styles.loginBtn} onClick={handleNavClick}>Log In</Link>
                            <Link href="/signup" className={styles.signupBtn} onClick={handleNavClick}>Sign Up</Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
