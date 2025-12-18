"use client";
import React, { useState } from 'react';
import styles from './page.module.css';
import { ZapIcon, StarIcon, TrophyIconSimple, TrendingUpIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import EditProfileModal from '@/components/EditProfileModal';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock Data for missing backend fields
  const mockStats = {
      level: 5,
      streak: 12,
      totalXp: 2450,
      hours: 48,
      rank: "Top 5%"
  };

  const activeFlows = [
      { id: 1, title: 'Learn React', progress: 45, color: 'linear-gradient(135deg, #6366f1, #a855f7)', modules: '12/24 modules' },
      { id: 2, title: 'Data Science', progress: 10, color: 'linear-gradient(135deg, #3b82f6, #06b6d4)', modules: '3/30 modules' },
      { id: 3, title: 'UX Principles', progress: 75, color: 'linear-gradient(135deg, #10b981, #34d399)', modules: '15/20 modules' },
  ];

  // Helper to get month labels for the last 12 months from today
  const getLast12Months = () => {
    const months = [];
    const date = new Date();
    date.setDate(1); // Set to first of current month
    for (let i = 0; i < 12; i++) {
        months.unshift(date.toLocaleString('default', { month: 'short' }));
        date.setMonth(date.getMonth() - 1);
    }
    return months;
  };
  
  const monthLabels = getLast12Months();

  // Generate mock heatmap data (365 days)
  const heatmapData = Array.from({ length: 365 }, () => Math.floor(Math.random() * 5)); 

  // Defaults if user is null or missing fields
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
            <div className={styles.levelBadge}>Lvl {mockStats.level}</div>
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
                  <span className={styles.statValue}>{mockStats.streak}</span>
                  <span className={styles.statLabel}>Day Streak</span>
              </div>
          </div>
          <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color: '#3b82f6'}}>
                  <StarIcon size={24} fill="currentColor" />
              </div>
              <div className={styles.statContent}>
                  <span className={styles.statValue}>{mockStats.totalXp}</span>
                  <span className={styles.statLabel}>Total XP</span>
              </div>
          </div>
          <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color: '#a855f7'}}>
                  <TrophyIconSimple size={24} />
              </div>
              <div className={styles.statContent}>
                  <span className={styles.statValue}>{mockStats.hours}h</span>
                  <span className={styles.statLabel}>Study Time</span>
              </div>
          </div>
           <div className={styles.statCard}>
              <div className={styles.statIcon} style={{color: '#10b981'}}>
                  <TrendingUpIcon size={24} />
              </div>
              <div className={styles.statContent}>
                  <span className={styles.statValue}>{mockStats.rank}</span>
                  <span className={styles.statLabel}>Rank</span>
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
              <div className={styles.heatmapGrid}>
                {heatmapData.map((level, i) => (
                    <div key={i} className={`${styles.heatBox} ${level > 0 ? styles['l'+level] : ''}`} title={`Activity Level: ${level}`}></div>
                ))}
            </div>
          </div>
      </div>

      {/* Active Flows */}
       <div className={styles.activeSection}>
          <h2 className={styles.sectionTitle}>Active Flows</h2>
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
      </div>

    </div>
  );
}
