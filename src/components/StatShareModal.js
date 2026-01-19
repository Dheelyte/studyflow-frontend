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
                scale: 2, // Retina resolution (2x) for better performance/size
                backgroundColor: null,
                useCORS: true,
                logging: false,
            });

            const link = document.createElement('a');
            link.download = `Primerly-stats-${Date.now()}.png`;
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
                        <div className={styles.confetti1}></div>
                        <div className={styles.confetti2}></div>
                        <div className={styles.confetti3}></div>

                        <div className={styles.cardHeader}>
                            <div className={styles.funTagline}>
                                I&apos;m on fire! 🔥
                            </div>
                        </div>

                        <div className={styles.mainStats}>
                            <div className={styles.mainStatItem}>
                                <div className={styles.mainStatValue}>{stats.streak}</div>
                                <div className={styles.mainStatLabel}>Day Streak</div>
                            </div>
                        </div>

                        <div className={styles.secondaryStatsRow}>
                            <div className={styles.secondaryStat}>
                                <span className={styles.secValue}>{stats.totalXp >= 1000 ? (stats.totalXp / 1000).toFixed(1) + 'k' : stats.totalXp}</span>
                                <span className={styles.secLabel}>Total XP</span>
                            </div>
                            <div className={styles.divider}></div>
                            <div className={styles.secondaryStat}>
                                <span className={styles.secValue}>{stats.level}</span>
                                <span className={styles.secLabel}>Level</span>
                            </div>
                        </div>

                        <div className={styles.userInfo}>
                            <div className={styles.avatar}>
                                {username.charAt(0)}
                            </div>
                            <div className={styles.userDetails}>
                                <div className={styles.userName}>{username}</div>
                                <div className={styles.userBadge}>{stats.title}</div>
                            </div>
                        </div>

                        <div className={styles.footerDomain}>
                            <span>Join me on </span>
                            <span className={styles.brandName}>Primerly</span>
                            <span className={styles.brandUrl}>www.primerly.app</span>
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
