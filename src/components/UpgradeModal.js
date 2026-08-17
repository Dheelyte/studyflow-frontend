"use client";
import Link from 'next/link';
import { ZapIcon, XIcon } from '@/components/Icons';
import styles from './UpgradeModal.module.css';

const METRIC_COPY = {
    course_generations: {
        title: "You've used this month's custom courses",
        period: 'month',
        unit: 'custom courses',
    },
    chat_messages: {
        title: "You've used today's tutor messages",
        period: 'day',
        unit: 'tutor messages',
    },
    screen_tutor_questions: {
        title: "You've used today's screen tutor questions",
        period: 'day',
        unit: 'screen questions',
    },
};

// Shown whenever an API call fails with 402 quota_exceeded.
// `quota` is the error body: { metric, limit, used, plan, detail }.
export default function UpgradeModal({ quota, onClose }) {
    if (!quota) return null;

    const copy = METRIC_COPY[quota.metric] || {
        title: "You've reached a plan limit",
        period: 'period',
        unit: 'uses',
    };
    const nextTier = quota.plan === 'pro' ? 'Max' : 'Pro';
    const isGenerations = quota.metric === 'course_generations';

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={copy.title}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                    <XIcon size={20} />
                </button>

                <div className={styles.iconWrapper}>
                    <ZapIcon size={22} fill="var(--primary)" />
                </div>

                <h3 className={styles.title}>{copy.title}</h3>
                <p className={styles.description}>
                    You&apos;ve used {quota.used} of {quota.limit} {copy.unit} this {copy.period} on
                    the {quota.plan === 'free' ? 'free' : quota.plan} plan.
                    {' '}{nextTier === 'Pro' ? 'Pro raises your limits.' : 'Max makes the tutors unlimited.'}
                </p>

                <div className={styles.meter}>
                    <div className={styles.meterFill} style={{ width: '100%' }} />
                </div>
                <p className={styles.meterLabel}>
                    {quota.used} of {quota.limit} used · resets {copy.period === 'day' ? 'at midnight UTC' : 'next month'}
                </p>

                <div className={styles.actions}>
                    <Link href="/pricing" className={styles.upgradeBtn} onClick={onClose}>
                        {nextTier === 'Pro' ? 'Upgrade to Pro' : 'Go Max'}
                    </Link>
                    {/* {isGenerations ? (
                        <Link href="/explore" className={styles.secondaryBtn} onClick={onClose}>
                            Find a ready-made course
                        </Link>
                    ) : (
                        <button className={styles.secondaryBtn} onClick={onClose}>
                            Maybe later
                        </button>
                    )} */}
                </div>
            </div>
        </div>
    );
}
