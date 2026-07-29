"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { gallery } from '@/services/api';
import styles from './EnrollButton.module.css';

export default function EnrollButton({ slug, compact = false }) {
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState(null);

    const handleClick = async () => {
        if (!isAuthenticated) {
            // Send them back here after signing up so the enrol can complete.
            router.push(`/signup?redirect=${encodeURIComponent(`/course/${slug}`)}`);
            return;
        }

        setError(null);
        setEnrolling(true);
        try {
            await gallery.enroll(slug);
            // Same URL — enrolling just unlocks the full learning view.
            router.refresh();
            window.location.reload();
        } catch (err) {
            setError(err.message || 'Could not start this course. Please try again.');
            setEnrolling(false);
        }
    };

    return (
        <div className={compact ? styles.wrapperCompact : styles.wrapper}>
            <button
                className={styles.button}
                onClick={handleClick}
                disabled={enrolling || authLoading}
            >
                {enrolling ? 'Starting…' : 'Start this course'}
            </button>
            {/* In the course controls row the button sits beside other actions, so the
                explanatory note would crowd it. */}
            {!compact && (
                <p className={styles.note}>
                    Free. Your progress, quizzes, and certificate are tracked separately from the
                    author's.
                </p>
            )}
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}
