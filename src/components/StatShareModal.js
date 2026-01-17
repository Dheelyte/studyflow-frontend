"use client";
import { useState, useRef } from 'react';
import styles from './StatShareModal.module.css';
import { XIcon, DownloadIcon } from './Icons';
import html2canvas from 'html2canvas';

export default function StatShareModal({ isOpen, onClose, stats, user }) {
    const cardRef = useRef(null);
    const [generating, setGenerating] = useState(false);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setGenerating(true);
        try {
            // Wait for fonts to load if possible, or just delay slightly
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                scale: 3, // High resolution
                backgroundColor: null,
                useCORS: true,
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `studywise-stats-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Failed to generate image", err);
            alert("Failed to generate image. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    const username = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Learner';
    const handle = user?.email ? `@${user.email.split('@')[0]}` : '@studywise';

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <XIcon size={24} />
                </button>

                <h2 className={styles.title}>Share Your Achievements</h2>
                <p className={styles.subtitle}>Download this card to celebrate your progress!</p>

                {/* The rendering container - this is what gets captured */}
                <div className={styles.previewContainer}>
                    <div className={styles.shareCard} ref={cardRef}>
                        {/* Background abstract shapes */}
                        <div className={styles.gradientBg}></div>
                        <div className={styles.circle1}></div>
                        <div className={styles.circle2}></div>

                        <div className={styles.cardHeader}>
                            <div className={styles.appLogo}>
                                <span className={styles.logoIcon}>⚡</span>
                                <span>Studywise</span>
                            </div>
                            <div className={styles.date}>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        </div>

                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {username.charAt(0)}
                            </div>
                            <div className={styles.userDetails}>
                                <div className={styles.userName}>{username}</div>
                            </div>
                            <div className={styles.badge}>
                                {stats.title}
                            </div>
                        </div>

                        <div className={styles.statsRow}>
                            <div className={styles.statBox}>
                                <div className={styles.statLabel}>Day Streak</div>
                                <div className={styles.statValue} style={{ color: '#facc15' }}>
                                    {stats.streak}
                                    <span className={styles.statUnit}>days</span>
                                </div>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.statBox}>
                                <div className={styles.statLabel}>Total XP</div>
                                <div className={styles.statValue} style={{ color: '#60a5fa' }}>
                                    {stats.totalXp >= 1000 ? (stats.totalXp / 1000).toFixed(1) + 'k' : stats.totalXp}
                                    <span className={styles.statUnit}>xp</span>
                                </div>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.statBox}>
                                <div className={styles.statLabel}>Current Level</div>
                                <div className={styles.statValue} style={{ color: '#34d399' }}>
                                    {stats.level}
                                </div>
                            </div>
                        </div>
                        <div className={styles.footerDomain}>
                            www.studywise.com
                        </div>
                    </div>
                </div>

                <button className={styles.downloadBtn} onClick={handleDownload} disabled={generating}>
                    <DownloadIcon size={20} />
                    {generating ? 'Generating...' : 'Download Image'}
                </button>
            </div>
        </div>
    );
}
