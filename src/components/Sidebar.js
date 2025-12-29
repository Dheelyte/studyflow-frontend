"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';
import { HomeIcon, LibraryIcon, PlusIcon, ZapIcon, ChevronLeft, ChevronRight, XIcon, LaptopIcon, UsersIcon, UserIcon, ChevronDown, ChevronUp, SunIcon, MoonIcon } from './Icons';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@/context/AuthContext';
import { useCommunity } from './CommunityContext';
import { curriculum } from '@/services/api';

export default function Sidebar({ isCollapsed, isOpen, onClose, onToggleCollapse, isMobile }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { communities = [], fetchInitialData } = useCommunity() || {};

  // Trigger initial fetch when Sidebar mounts
  useEffect(() => {
      if (fetchInitialData) {
          fetchInitialData();
      }
  }, [fetchInitialData]);
  
  // Accordion States (Expanded by default)
  const [isLibraryOpen, setIsLibraryOpen] = useState(true);
  const [isCommunityOpen, setIsCommunityOpen] = useState(true);

  // Playlist State
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
        if (!user) {
            setPlaylists([]);
            return;
        }
        try {
            const response = await curriculum.getMyPlaylists();
            if (Array.isArray(response)) {
                const colors = [
                    'linear-gradient(135deg, #6366f1, #a855f7)', 
                    'linear-gradient(135deg, #3b82f6, #06b6d4)', 
                    'linear-gradient(135deg, #10b981, #34d399)', 
                    'linear-gradient(135deg, #f59e0b, #fbbf24)', 
                    'linear-gradient(135deg, #ec4899, #f472b6)' 
                ];

                const mapped = response.map((item, index) => ({
                    id: item.id,
                    title: item.playlist?.title || "Untitled",
                    progress: "In Progress", // Mock
                    color: colors[index % colors.length],
                    link: `/playlist/${item.playlist?.id || 1}`
                }));
                // We only show top 3 in sidebar usually? Or slice.
                setPlaylists(mapped);
            }
        } catch (error) {
           console.error("Sidebar playlist fetch error", error);
        }
    };

    fetchPlaylists();
  }, [user?.id]);


  // Helper to generate consistent colors based on ID/Name
  const getCommunityColor = (id) => {
      const str = String(id);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = ['#6366f1', '#eab308', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
      return colors[Math.abs(hash) % colors.length];
  };

  const formatMembers = (count) => {
      if (!count) return '0 members';
      if (count >= 1000) return `${(count / 1000).toFixed(1)}k members`;
      return `${count} members`;
  };

  const sidebarCommunities = user 
      ? (communities || []).filter(c => c.isJoined)
      : (communities || []);

  const displayedCommunities = sidebarCommunities.slice(0, 2);
  const displayedPlaylists = playlists.slice(0, 3); // Show top 3

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
  
  const handleNavClick = () => {
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

                <button 
                  className={styles.toggleCollapseBtn}
                  onClick={handleToggleTheme}
                  title="Cycle Theme"
                  style={{
                      top: '56px', 
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
                        <Link href="/library" style={{display:'flex', gap:'16px', alignItems:'center', textDecoration:'none', color:'inherit', flex:1}} onClick={handleNavClick}>
                            <LibraryIcon />
                            <span>Library</span>
                        </Link>
                        
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
                             {displayedPlaylists.length > 0 && displayedPlaylists.map(flow => (
                                <Link href={flow.link} key={flow.id} className={styles.playlistItem} style={{padding: '8px 12px'}} onClick={handleNavClick}>
                                    <div className={styles.playlistImage} style={{ background: flow.color, width:'28px', height:'28px', borderRadius:'6px' }}></div>
                                    <div className={styles.playlistInfo}>
                                        <div className={styles.playlistName} style={{fontSize:'0.85rem'}}>{flow.title}</div>
                                        <div className={styles.playlistMeta} style={{fontSize:'0.75rem'}}>{flow.progress}</div>
                                    </div>
                                </Link>
                            ))}
                            
                             {displayedPlaylists.length > 0 && (
                                <Link href="/library" className={styles.seeAllBtn} style={{padding:'8px 12px', color:'var(--primary)', fontWeight:'600', fontSize:'0.85rem'}} onClick={handleNavClick}>
                                    See All
                                </Link>
                             )}
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
                        <Link href="/community" style={{display:'flex', gap:'16px', alignItems:'center', textDecoration:'none', color:'inherit', flex:1}} onClick={handleNavClick}>
                            <UsersIcon />
                            <span>Community</span>
                        </Link>

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
                            {/* Dynamically rendered communities - Only render if not empty */}
                            {displayedCommunities.length > 0 && displayedCommunities.map((comm) => {
                                const commColor = getCommunityColor(comm.id);
                                return (
                                <Link href={`/community/${comm.id}`} key={comm.id} className={styles.playlistItem} style={{padding: '8px 12px'}} onClick={handleNavClick}>
                                    <div className={styles.playlistImage} style={{ 
                                        background: 'transparent', 
                                        border: `1px solid ${commColor}`,
                                        width:'28px', height:'28px',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: commColor, fontWeight: '700', fontSize: '0.8rem'
                                    }}>
                                        {comm.name ? comm.name.substring(0,1) : '#'}
                                    </div>
                                    <div className={styles.playlistInfo}>
                                        <div className={styles.playlistName} style={{fontSize:'0.85rem'}}>{comm.name || 'Community'}</div>
                                        <div className={styles.playlistMeta} style={{fontSize:'0.75rem'}}>{formatMembers(comm.memberCount)}</div>
                                    </div>
                                </Link>
                                );
                            })}
                            
                            {/* Only show 'Manage/Explore' if there are communities to show, per user request to be 'empty' otherwise */}
                            {displayedCommunities.length > 0 && (
                                <Link href="/community" className={styles.seeAllBtn} style={{padding:'8px 12px', color:'var(--primary)', fontWeight:'600', fontSize:'0.85rem'}} onClick={handleNavClick}>
                                    {user ? "Manage Communities" : "Explore All"}
                                </Link>
                            )}
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
