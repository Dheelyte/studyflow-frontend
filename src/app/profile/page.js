"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { ZapIcon, StarIcon, TrophyIconSimple, TrendingUpIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { users, curriculum } from '@/services/api'; 
import EditProfileModal from '@/components/EditProfileModal';

export default function ProfilePage() {
  const { user, updateUser, checkUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const scrollRef = useRef(null);

  // Real Data from AuthContext
  const stats = {
      level: user?.level || 1,
      streak: user?.current_streak || 0,
      totalXp: user?.total_xp || 0,
      title: user?.level_name || "Novice" 
  };

  const [activeFlows, setActiveFlows] = useState([]);

  const getLast12Months = () => {
    const months = [];
    const date = new Date();
    date.setDate(1); 
    for (let i = 0; i < 12; i++) {
        months.unshift(date.toLocaleString('default', { month: 'short' }));
        date.setMonth(date.getMonth() - 1);
    }
    return months;
  };
  
  const monthLabels = getLast12Months();

  const [heatmapData, setHeatmapData] = useState(Array(365).fill(0));

  const getIntensityClass = (count) => {
      if (count === 0) return '';
      if (count >= 4) return styles.l4;
      if (count === 3) return styles.l3;
      if (count === 2) return styles.l2;
      return styles.l1;
  };

  useEffect(() => {
    const fetchActivity = async () => {
        try {
            const response = await users.getMyActivity();
            if (response && response.activities) {
                const activityMap = new Map();
                response.activities.forEach(act => {
                    activityMap.set(act.date, act.activity_count);
                });

                const data = [];
                const today = new Date();
                
                for (let i = 364; i >= 0; i--) {
                     const d = new Date(today);
                     d.setDate(d.getDate() - i);
                     // Local YYYY-MM-DD
                     const dateStr = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
                     
                     const count = activityMap.get(dateStr) || 0;
                     data.push(count);
                }
                setHeatmapData(data);
            }
        } catch (error) {
            console.error("Failed to fetch activity log:", error);
        }
    };

    const fetchPlaylists = async () => {
        try {
            // Using curriculum service to fetch my playlists
            const response = await curriculum.getMyPlaylists();
            if (Array.isArray(response)) {
                // Map API response to UI model
                // API: [{ id, user_id, created_at, playlist: { id, title } }]
                const colors = [
                    'linear-gradient(135deg, #6366f1, #a855f7)', // Indigo-Purple
                    'linear-gradient(135deg, #3b82f6, #06b6d4)', // Blue-Cyan
                    'linear-gradient(135deg, #10b981, #34d399)', // Green-Emerald
                    'linear-gradient(135deg, #f59e0b, #fbbf24)', // Amber-Yellow
                    'linear-gradient(135deg, #ec4899, #f472b6)'  // Pink-Rose
                ];

                const mapped = response.map((item, index) => ({
                    id: item.id, // UserPlaylist ID
                    title: item.playlist?.title || "Untitled Playlist",
                    // Mocking progress as API doesn't provide it yet
                    progress: 0, 
                    color: colors[index % colors.length],
                    modules: 'Start Learning' // Default text
                }));
                setActiveFlows(mapped);
            }
        } catch (error) {
             console.error("Failed to fetch playlists:", error);
        }
    };

    if (user) {
        fetchActivity();
        fetchPlaylists();
    }
  }, [user?.id]);

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Scroll to end (current month) on load
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [heatmapData]);

  const defaultName = "Delight Gbolahan";
  const defaultHandle = "@delight_dev";
  const defaultBio = "Full-stack developer in training. Obsessed with React and clean UI. Building StudyFlow to help others learn faster.";

  const displayName = user && user.first_name ? `${user.first_name} ${user.last_name}` : defaultName;
  const displayHandle = user && user.email ? `@${user.email.split('@')[0]}` : defaultHandle;
  const displayBio = user && user.bio ? user.bio : defaultBio;

  const effectiveUser = user || {
    first_name: 'Delight',
    last_name: 'Gbolahan',
    email: 'delight@example.com',
    bio: defaultBio
  };

  return (
    <div className={styles.page}>
      
      {/* Edit Profile Modal */}
      {isEditModalOpen && (
          <EditProfileModal 
            user={effectiveUser} 
            onClose={() => setIsEditModalOpen(false)}
            onSave={updateUser}
          />
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
            <div className={styles.avatarRing}></div>
            <div className={styles.avatar}>
               {displayName.charAt(0)}
            </div>
            <div className={styles.levelBadge}>Lvl {stats.level}</div>
        </div>
        
        <div className={styles.userInfo}>
            <div className={styles.headerInfo}>
                <div className={styles.identity}>
                     <h1 className={styles.name}>{displayName}</h1>
                     <div className={styles.handle}>{displayHandle}</div>
                </div>
                <button className={styles.editBtn} onClick={() => setIsEditModalOpen(true)}>Edit Profile</button>
            </div>
            <p className={styles.bio}>{displayBio}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
          <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color: '#eab308'}}>
                  <ZapIcon size={24} fill="currentColor" />
              </div>
              <div className={styles.statContent}>
                  <span className={styles.statValue}>{stats.streak}</span>
                  <span className={styles.statLabel}>Day Streak</span>
              </div>
          </div>
          <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color: '#3b82f6'}}>
                  <StarIcon size={24} fill="currentColor" />
              </div>
              <div className={styles.statContent}>
                  <span className={styles.statValue}>{stats.totalXp}</span>
                  <span className={styles.statLabel}>Total XP</span>
              </div>
          </div>
           <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color: '#10b981'}}>
                  <TrophyIconSimple size={24} />
              </div>
              <div className={styles.statContent}>
                  <span className={styles.statValue}>{stats.title}</span>
                  <span className={styles.statLabel}>Level {stats.level}</span>
              </div>
          </div>
      </div>

      {/* Activity Map */}
      <div className={styles.heatmapSection}>
          <div className={styles.sectionTitle}>
              <span>Activity Log</span>
              <span style={{fontSize:'0.9rem', color:'var(--secondary)', fontWeight:'400'}}>Last 365 Days</span>
          </div>
          
          <div className={styles.heatmapContainer}>
              {/* Month Labels */}
              <div className={styles.monthLabels}>
                  {monthLabels.map((month, i) => (
                      <span key={i}>{month}</span>
                  ))}
              </div>

              {/* Grid */}
              <div ref={scrollRef} className={styles.heatmapGrid}>
                {heatmapData.map((count, i) => (
                    <div 
                        key={i} 
                        className={`${styles.heatBox} ${getIntensityClass(count)}`} 
                        title={`Activity: ${count} contributions`}
                    ></div>
                ))}
            </div>
          </div>
      </div>

      {/* Active Flows */}
       <div className={styles.activeSection}>
          <h2 className={styles.sectionTitle}>Active Flows</h2>
          {activeFlows.length > 0 ? (
            <div className={styles.flowsGrid}>
                {activeFlows.map(flow => (
                    <div key={flow.id} className={styles.flowCard}>
                        <div className={styles.flowHeader} style={{background: flow.color}}>
                            <span style={{width: 'fit-content', background:'rgba(0,0,0,0.2)', padding:'4px 8px', borderRadius:'6px', fontSize:'0.75rem', backdropFilter:'blur(4px)'}}>
                                In Progress
                            </span>
                        </div>
                        <div className={styles.flowBody}>
                            <div className={styles.flowTitle}>{flow.title}</div>
                            <div className={styles.flowMeta}>
                                <span>{flow.modules}</span>
                                <span>{flow.progress}%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progress} style={{width: `${flow.progress}%`}}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div style={{color: 'var(--secondary)', padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '16px'}}>
                No active flows found. Start a new curriculum to see it here!
            </div>
          )}
      </div>

    </div>
  );
}
