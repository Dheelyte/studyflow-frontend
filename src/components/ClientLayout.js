"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from './Icons';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileHeader from './MobileHeader';
import styles from './ClientLayout.module.css';
import { CommunityProvider } from './CommunityContext';
import AuthGuard from './AuthGuard';

export default function ClientLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const mainRef = useRef(null);

  // Reset scroll on pathname change
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname]);

  // Hide sidebar on auth pages AND Landing Page (root /) AND Info Pages
  const isAuthPage = 
    pathname?.startsWith('/login') || 
    pathname?.startsWith('/signup') || 
    pathname?.startsWith('/forgot-password') || 
    pathname?.startsWith('/reset-password') || 
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    pathname === '/privacy-policy' ||
    pathname === '/terms-of-service' ||
    pathname === '/cookie-policy';

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
        
        {isMobile && !isAuthPage && <BottomNav />}
        <div className={styles.mainWrapper}>
            {!isAuthPage && <MobileHeader onMenuClick={toggleSidebar} />}
             
            <main ref={mainRef} className={`${styles.contentScroll} ${!isAuthPage ? styles.withBottomNav : ''}`}>
                {(pathname === '/about' || pathname === '/contact' || pathname === '/privacy-policy' || pathname === '/terms-of-service' || pathname === '/cookie-policy') && (
                    <div 
                        onClick={() => router.back()} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            color: '#8A2BE2', 
                            cursor: 'pointer', 
                            padding: '20px 20px 0 20px', 
                            fontSize: '17px', 
                            fontWeight: '500',
                            marginBottom: '0px',
                            flexShrink: 0
                        }}
                    >
                        <ChevronLeft size={24} /> Back
                    </div>
                )}
                {children}
            </main>
        </div>
        </div>
    </AuthGuard>
    </CommunityProvider>
  );
}