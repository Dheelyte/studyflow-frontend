"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { HomeIcon, LibraryIcon, PlusIcon, ZapIcon, ChevronLeft, ChevronRight, XIcon, LaptopIcon, UsersIcon, UserIcon, ChevronDown, ChevronUp, SunIcon, MoonIcon } from './Icons';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isCollapsed, isOpen, onClose, onToggleCollapse, isMobile }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Accordion States (Expanded by default)
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isCommunityOpen, setIsCommunityOpen] = useState(true);

  // Mock Data
  const yourFlows = [
      { id: 1, title: 'Learn React', progress: '45% Complete', color: 'linear-gradient(135deg, #6366f1, #a855f7)' },
      { id: 2, title: 'Data Science', progress: 'Just Started', color: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
      { id: 3, title: 'UX Principles', progress: 'Module 2', color: 'linear-gradient(135deg, #10b981, #34d399)' },
      { id: 4, title: 'System Design', progress: '10% Complete', color: 'linear-gradient(135deg, #f59e0b, #f97316)' },
  ];

  const yourCommunities = [
      { id: 'react', name: 'React Mastery', members: '12.4k', color: '#6366f1' },
      { id: 'python', name: 'Python Devs', members: '8.2k', color: '#eab308' },
      { id: 'design', name: 'UI/UX Design', members: '5.1k', color: '#ec4899' },
      { id: 'web3', name: 'Web3 Builders', members: '3.3k', color: '#8b5cf6' },
  ];

  const handleToggleTheme = () => {
      if (theme === 'system') setTheme('light');
      else if (theme === 'light') setTheme('dark');
      else setTheme('system');
  };

  const getThemeIcon = () => {
      if (theme === 'system') return <LaptopIcon size={14} />;
      if (theme === 'light') return <SunIcon size={14} />; 
      return <MoonIcon size={14} />; 
  };
  
  // Close sidebar on mobile when a link is clicked
  const handleNavClick = () => {
      if (isMobile && onClose) {
          onClose();
      }
  };

  const sidebarClasses = `${styles.sidebar} ${isCollapsed ? styles.collapsed : ''} ${isOpen ? styles.open : ''}`;

  return (
    <>
        {/* Mobile Backdrop */}
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
                {/* Collapse Button (Original Position - Floating on Edge) */}
                <button className={styles.toggleCollapseBtn} onClick={onToggleCollapse} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Theme Toggle Button (Next to Collapse Button) */}
                <button 
                  className={styles.toggleCollapseBtn}
                  onClick={handleToggleTheme}
                  title="Cycle Theme"
                  style={{
                      top: '56px', /* Positioned below the collapse button (20px + 24px + gap) */
                  }}
                >
                   {getThemeIcon()}
                </button>
              </>
          )}

          <nav className={styles.navContainer}>
            <Link href="/" className={styles.logo} style={{textDecoration: 'none'}}>
              <ZapIcon size={28} fill="var(--primary)" /> <span>StudyFlow</span>
            </Link>
             
            <Link href="/dashboard" className={styles.navItem} onClick={handleNavClick}>
              <HomeIcon />
              <span>Home</span>
            </Link>

            {/* Profile Link */}
            <Link href="/profile" className={styles.navItem} onClick={handleNavClick}>
                <UserIcon />
                <span>Profile</span>
             </Link>

            {/* Library Accordion */}
            {isCollapsed ? (
                 <Link href="/library" className={styles.navItem} title="Library" onClick={handleNavClick}>
                     <LibraryIcon />
                 </Link>
            ) : (
                <>
                    <div 
                        className={`${styles.navItem} ${isLibraryOpen ? styles.active : ''}`} 
                        style={{cursor: 'pointer', justifyContent: 'space-between', paddingRight:'8px', marginTop: '0'}}
                    >
                        {/* Parent Click Link */}
                        <Link href="/library" style={{display:'flex', gap:'16px', alignItems:'center', textDecoration:'none', color:'inherit', flex:1}} onClick={handleNavClick}>
                            <LibraryIcon />
                            <span>Library</span>
                        </Link>
                        
                        {/* Toggle Icon Button */}
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsLibraryOpen(!isLibraryOpen);
                            }}
                            style={{padding:'4px', display:'flex', alignItems:'center'}}
                        >
                            {isLibraryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    </div>
                    {isLibraryOpen && (
                        <div style={{
                            paddingLeft:'0', 
                            marginTop:'0', 
                            marginBottom:'16px', 
                            display:'flex', 
                            flexDirection:'column', 
                            gap:'8px',
                            marginLeft: '0'
                        }}>
                             {yourFlows.slice(0, 2).map(flow => (
                                <Link href={`/playlist/${flow.id}`} key={flow.id} className={styles.playlistItem} style={{padding: '8px 12px'}} onClick={handleNavClick}>
                                    <div className={styles.playlistImage} style={{ background: flow.color, width:'28px', height:'28px', borderRadius:'6px' }}></div>
                                    <div className={styles.playlistInfo}>
                                        <div className={styles.playlistName} style={{fontSize:'0.85rem'}}>{flow.title}</div>
                                        <div className={styles.playlistMeta} style={{fontSize:'0.75rem'}}>{flow.progress}</div>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/library" className={styles.seeAllBtn} style={{padding:'8px 12px', color:'var(--primary)', fontWeight:'600', fontSize:'0.85rem'}} onClick={handleNavClick}>
                                See All
                            </Link>
                        </div>
                    )}
                </>
            )}

            {/* Community Accordion */}
             {isCollapsed ? (
                 <Link href="/community" className={styles.navItem} title="Community" onClick={handleNavClick}>
                     <UsersIcon />
                 </Link>
            ) : (
                <>
                    <div 
                        className={`${styles.navItem} ${isCommunityOpen ? styles.active : ''}`} 
                        style={{cursor: 'pointer', justifyContent: 'space-between', paddingRight:'8px'}}
                    >
                        {/* Parent Click Link */}
                        <Link href="/community" style={{display:'flex', gap:'16px', alignItems:'center', textDecoration:'none', color:'inherit', flex:1}} onClick={handleNavClick}>
                            <UsersIcon />
                            <span>Community</span>
                        </Link>

                        {/* Toggle Icon Button */}
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setIsCommunityOpen(!isCommunityOpen);
                            }}
                             style={{padding:'4px', display:'flex', alignItems:'center'}}
                        >
                            {isCommunityOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                    </div>
                    {isCommunityOpen && (
                        <div style={{
                            paddingLeft:'0', 
                            marginTop:'0', 
                            marginBottom:'16px', 
                            display:'flex', 
                            flexDirection:'column', 
                            gap:'8px',
                            marginLeft: '0'
                        }}>
                            {yourCommunities.slice(0, 2).map((comm) => (
                                <Link href={`/community/${comm.id}`} key={comm.id} className={styles.playlistItem} style={{padding: '8px 12px'}} onClick={handleNavClick}>
                                    <div className={styles.playlistImage} style={{ 
                                        background: 'transparent', 
                                        border: `1px solid ${comm.color}`,
                                        width:'28px', height:'28px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: comm.color, fontWeight: '700', fontSize: '0.8rem'
                                    }}>
                                        {comm.name.substring(0,1)}
                                    </div>
                                    <div className={styles.playlistInfo}>
                                        <div className={styles.playlistName} style={{fontSize:'0.85rem'}}>{comm.name}</div>
                                        <div className={styles.playlistMeta} style={{fontSize:'0.75rem'}}>{comm.members}</div>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/community" className={styles.seeAllBtn} style={{padding:'8px 12px', color:'var(--primary)', fontWeight:'600', fontSize:'0.85rem'}} onClick={handleNavClick}>
                                See All
                            </Link>
                        </div>
                    )}
                </>
            )}

          </nav>

          <div className={styles.footer}>
             
            {!user ? (
                <div className={styles.authButtons}>
                    <Link href="/login" className={styles.loginBtn} onClick={handleNavClick}>Log In</Link>
                    <Link href="/signup" className={styles.signupBtn} onClick={handleNavClick}>Sign Up</Link>
                </div>
            ) : (
               <div className={styles.authButtons}>
                    <button onClick={() => { logout(); handleNavClick(); }} className={styles.loginBtn} style={{width:'100%', cursor:'pointer'}}>Log Out</button>
               </div>
            )}
          </div>
        </aside>
    </>
  );
}
