"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './PlanBadge.module.css';

const PLAN_LABELS = { pro: 'Pro', max: 'Max' };

export function planLabel(plan) {
    return PLAN_LABELS[plan] || (plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : '');
}

// Header chrome: a plan badge when the user is on a paid tier, an Upgrade
// button when they're not. Renders nothing for logged-out visitors — the
// header shows sign-in affordances for them elsewhere.
export default function PlanBadge() {
    const { user, isPaid, plan } = useAuth();
    if (!user) return null;

    if (isPaid) {
        return (
            <Link
                href="/profile"
                className={`${styles.badge} ${plan === 'max' ? styles.max : styles.pro}`}
                title="Manage your subscription"
            >
                {planLabel(plan)}
            </Link>
        );
    }

    return (
        <Link href="/pricing" className={styles.upgrade}>
            Upgrade
        </Link>
    );
}
