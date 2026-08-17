"use client";
import React, { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { ZapIcon, StarIcon, TrophyIconSimple, ShareIcon } from '@/components/Icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/ThemeProvider';
import { users, curriculum, billing } from '@/services/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EditProfileModal from '@/components/EditProfileModal';
import StatShareModal from '@/components/StatShareModal';
import { PLANS, formatNaira } from '@/lib/plans';

// Recurring charge amount for a tier+interval, straight from the pricing source of truth.
const planPrice = (tier, interval) => {
    const plan = PLANS.find((p) => p.id === tier);
    if (!plan) return null;
    return interval === 'annual' ? plan.priceAnnual : plan.priceMonthly;
};

const formatLongDate = (value) =>
    new Date(value).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });

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
    const [certificates, setCertificates] = useState([]);
    const [billingStatus, setBillingStatus] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        billing.status()
            .then((data) => { if (!cancelled) setBillingStatus(data); })
            .catch(() => { /* subscription card is non-essential */ });
        return () => { cancelled = true; };
    }, [user?.id]);

    const handleCancelSubscription = async () => {
        if (!window.confirm("Cancel your subscription? You'll keep your current plan until the end of the billing period.")) {
            return;
        }
        try {
            setCancelling(true);
            await billing.cancel();
            const data = await billing.status();
            setBillingStatus(data);
        } catch (err) {
            console.error('Failed to cancel subscription', err);
            alert('Could not cancel right now. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await curriculum.listMyCertificates();
                if (!cancelled) setCertificates(data || []);
            } catch (err) {
                console.error("Failed to fetch certificates:", err);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

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


            {/* Certificates */}
            <div className={styles.certificatesSection}>
                <div className={styles.sectionTitle}>
                    <span>Certificates</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--secondary)', fontWeight: '400' }}>
                        {certificates.length} earned
                    </span>
                </div>
                {certificates.length === 0 ? (
                    <div className={styles.certificatesEmpty}>
                        Finish every topic and quiz in a course to earn a certificate.
                    </div>
                ) : (
                    <div className={styles.certificatesList}>
                        {certificates.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={styles.certificateCard}
                                onClick={() => router.push(`/certificate/${c.verification_code}`)}
                            >
                                <div className={styles.certificateCardIcon}>🏆</div>
                                <div className={styles.certificateCardBody}>
                                    <div className={styles.certificateCardTitle}>{c.playlist_title}</div>
                                    <div className={styles.certificateCardMeta}>
                                        Issued {new Date(c.issued_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className={styles.certificateCardArrow}>›</div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Subscription Section */}
            <div className={styles.settingsSection}>
                <div className={styles.sectionTitle}>
                    <span>Subscription</span>
                </div>
                <div className={styles.settingRow}>
                    <div className={styles.settingLabel}>
                        <span>
                            Current plan:{' '}
                            <span className={styles.planBadge}>
                                {(billingStatus?.plan || user?.plan || 'free').toUpperCase()}
                            </span>
                        </span>
                        <span className={styles.settingDesc}>
                            {billingStatus?.plan && billingStatus.plan !== 'free'
                                ? `Your ${billingStatus.plan.charAt(0).toUpperCase()}${billingStatus.plan.slice(1)} plan`
                                : 'Courses, certificates & community are always free'}
                        </span>
                    </div>
                    {billingStatus?.plan && billingStatus.plan !== 'free' ? (
                        billingStatus.subscription?.status === 'non_renewing' ? (
                            <Link href="/pricing" className={styles.upgradeLink}>Resubscribe</Link>
                        ) : (
                            <button
                                onClick={handleCancelSubscription}
                                className={styles.cancelPlanBtn}
                                disabled={cancelling}
                            >
                                {cancelling ? 'Cancelling…' : 'Cancel plan'}
                            </button>
                        )
                    ) : (
                        <Link href="/pricing" className={styles.upgradeLink}>Upgrade</Link>
                    )}
                </div>
                {(() => {
                    // Transparent billing dates for paid plans: when the current
                    // period ends, and whether that means a charge or an ending.
                    const sub = billingStatus?.subscription;
                    if (!sub || !sub.current_period_end || billingStatus.plan === 'free') return null;
                    const endDate = formatLongDate(sub.current_period_end);
                    const charge = planPrice(sub.tier, sub.interval);
                    return (
                        <div className={styles.billingDates}>
                            {sub.status === 'non_renewing' ? (
                                <>
                                    <div className={styles.billingDateRow}>
                                        <span>Plan ends</span>
                                        <span className={styles.billingDateValue}>{endDate}</span>
                                    </div>
                                    <div className={styles.billingDateRow}>
                                        <span>Next charge</span>
                                        <span className={styles.billingDateValue}>None — you won&apos;t be charged again</span>
                                    </div>
                                </>
                            ) : sub.status === 'past_due' ? (
                                <div className={styles.billingDateRow}>
                                    <span>Payment overdue</span>
                                    <span className={styles.billingDateValue}>We&apos;re retrying your card — your plan stays active meanwhile</span>
                                </div>
                            ) : (
                                <>
                                    <div className={styles.billingDateRow}>
                                        <span>Renews</span>
                                        <span className={styles.billingDateValue}>{endDate}</span>
                                    </div>
                                    <div className={styles.billingDateRow}>
                                        <span>Next charge</span>
                                        <span className={styles.billingDateValue}>
                                            {charge != null ? `${formatNaira(charge)} on ${endDate}` : endDate}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })()}
                {billingStatus?.usage && (
                    <div className={styles.usageList}>
                        {[
                            { key: 'chat_messages', label: 'Tutor messages' },
                            { key: 'screen_tutor_questions', label: 'Screen tutor' },
                        ].map(({ key, label }) => {
                            const metric = billingStatus.usage[key];
                            if (!metric) return null;
                            // Max is sold as unlimited — show that, even though a high
                            // abuse-guard limit exists under the hood.
                            const unlimited = billingStatus.plan === 'max';
                            const pct = Math.min(100, Math.round((metric.used / metric.limit) * 100));
                            return (
                                <div key={key} className={styles.usageRow}>
                                    <div className={styles.usageHeader}>
                                        <span>{label}</span>
                                        <span className={styles.usageCount}>
                                            {unlimited
                                                ? 'Unlimited'
                                                : `${metric.used} / ${metric.limit} this ${metric.period === 'daily' ? 'day' : 'month'}`}
                                        </span>
                                    </div>
                                    {!unlimited && (
                                        <div className={styles.usageMeter}>
                                            <div className={styles.usageMeterFill} style={{ width: `${pct}%` }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
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
