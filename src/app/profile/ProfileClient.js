"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { ZapIcon, StarIcon, TrophyIconSimple, ShareIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { users } from '@/services/api';
import EditProfileModal from '@/components/EditProfileModal';
import StatShareModal from '@/components/StatShareModal';

export default function ProfileClient() {
    const { user, updateUser, checkUser, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const scrollRef = useRef(null);

    // Real Data from AuthContext
    const stats = {
        level: user?.level || 1,
        streak: user?.current_streak || 0,
        totalXp: user?.total_xp || 0,
        title: user?.level_name || "Novice"
    };

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

    const [heatmapData, setHeatmapData] = useState([]);
    const [tooltipData, setTooltipData] = useState({ visible: false, x: 0, y: 0, count: 0, date: "" });

    const handleInteraction = (e, dayData) => {
        const rect = e.target.getBoundingClientRect();
        setTooltipData({
            x: rect.left + rect.width / 2,
            y: rect.top,
            count: dayData.count,
            date: dayData.date,
            visible: true
        });
    };

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

                    // Start from ~1 year ago, aligned to Sunday
                    const startDate = new Date(today);
                    startDate.setDate(today.getDate() - 365);
                    const dayOfWeek = startDate.getDay();
                    if (dayOfWeek !== 0) {
                        startDate.setDate(startDate.getDate() - dayOfWeek);
                    }

                    const itr = new Date(startDate);
                    while (itr <= today) {
                        const dateStr = itr.getFullYear() + '-' + String(itr.getMonth() + 1).padStart(2, '0') + '-' + String(itr.getDate()).padStart(2, '0');

                        const count = activityMap.get(dateStr) || 0;
                        data.push({ count, date: dateStr });
                        itr.setDate(itr.getDate() + 1);
                    }
                    setHeatmapData(data);
                }
            } catch (error) {
                console.error("Failed to fetch activity log:", error);
            }
        };

        if (user) {
            fetchActivity();
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

    const defaultName = "Learner";
    const defaultHandle = "@learner";
    const defaultBio = "Learning every day.";

    const displayName = user && user.first_name ? `${user.first_name} ${user.last_name}` : defaultName;
    const displayHandle = user && user.email ? `@${user.email.split('@')[0]}` : defaultHandle;
    const displayBio = user && user.bio ? user.bio : defaultBio;

    const effectiveUser = user || {
        first_name: 'Learner',
        last_name: '',
        email: 'learner@example.com',
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
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)} title="Share Stats">
                        <ShareIcon size={16} />
                    </button>
                    <div className={styles.statIcon} style={{ color: '#eab308' }}>
                        <ZapIcon size={24} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.streak}</span>
                        <span className={styles.statLabel}>Day Streak</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)} title="Share Stats">
                        <ShareIcon size={16} />
                    </button>
                    <div className={styles.statIcon} style={{ color: '#3b82f6' }}>
                        <StarIcon size={24} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statValue}>{stats.totalXp}</span>
                        <span className={styles.statLabel}>Total XP</span>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <button className={styles.shareBtn} onClick={() => setIsShareModalOpen(true)} title="Share Stats">
                        <ShareIcon size={16} />
                    </button>
                    <div className={styles.statIcon} style={{ color: '#10b981' }}>
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
                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '400' }}>Last Year</span>
                </div>

                <div className={styles.heatmapFlexContainer}>
                    {/* Day Labels - Fixed to left */}
                    <div className={styles.dayLabels}>
                        <span></span>
                        <span>Mon</span>
                        <span></span>
                        <span>Wed</span>
                        <span></span>
                        <span>Fri</span>
                        <span></span>
                    </div>

                    <div className={styles.heatmapScrollWrapper} ref={scrollRef}>
                        <div className={styles.heatmapInnerContent}>
                            {/* Month Labels */}
                            <div className={styles.monthLabels}>
                                {monthLabels.map((month, i) => (
                                    <span key={i}>{month}</span>
                                ))}
                            </div>

                            {/* Grid */}
                            <div className={styles.heatmapGrid}>
                                {heatmapData.map((dayData, i) => (
                                    <div
                                        key={i}
                                        className={`${styles.heatBox} ${getIntensityClass(dayData.count)}`}
                                        onMouseEnter={(e) => handleInteraction(e, dayData)}
                                        onClick={(e) => handleInteraction(e, dayData)}
                                        onMouseLeave={() => setTooltipData(prev => ({ ...prev, visible: false }))}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Settings Section */}
            <div className={styles.settingsSection}>
                <div className={styles.sectionTitle}>
                    <span>Appearance</span>
                </div>
                <div className={styles.settingRow}>
                    <div className={styles.settingLabel}>
                        <span>Dark Mode</span>
                        <span className={styles.settingDesc}>Use a dark color scheme</span>
                    </div>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>

            <div className={styles.logoutSection}>
                <button onClick={logout} className={styles.logoutBtn}>
                    Log Out
                </button>
            </div>

            {tooltipData.visible && (
                <div
                    className={styles.tooltip}
                    style={{ top: tooltipData.y, left: tooltipData.x }}
                >
                    {tooltipData.count === 0 ? `No activity on ${tooltipData.date}` : `${tooltipData.count} activities on ${tooltipData.date}`}
                </div>
            )}
            <StatShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                stats={stats}
                user={effectiveUser}
            />
        </div>
    );
}
