"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import styles from './ClientLayout.module.css';
import { CommunityProvider } from './CommunityContext';
import AuthGuard from './AuthGuard';

export default function ClientLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Hide sidebar on auth pages AND Landing Page (root /)
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/signup') || pathname === '/';

  // Check screen size for responsiveness
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
          setIsMobileSidebarOpen(false);
      }
    };
    
    // Initial check
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
      if (isMobile) setIsMobileSidebarOpen(false);
  };

  let containerClass = styles.container;
  if (!isAuthPage && !isMobile) {
      containerClass = `${styles.container} ${isSidebarCollapsed ? styles.desktopSidebarCollapsed : styles.desktopSidebarOpen}`;
  }

  return (
    <CommunityProvider>
        <AuthGuard>
        <div className={containerClass}>
        {!isAuthPage && (
            <Sidebar 
                isCollapsed={!isMobile && isSidebarCollapsed} 
                isOpen={isMobile && isMobileSidebarOpen}
                onClose={closeMobileSidebar}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobile={isMobile}
            />
        )}
        
        <div className={styles.mainWrapper}>
            {!isAuthPage && <MobileHeader onMenuClick={toggleSidebar} />}
            <main className={styles.contentScroll}>
                {children}
            </main>
        </div>
        </div>
    </AuthGuard>
    </CommunityProvider>
  );
}
