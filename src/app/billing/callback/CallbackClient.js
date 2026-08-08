"use client";
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { billing } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { CheckCircleIcon, ClockIcon } from '@/components/Icons';
import styles from './callback.module.css';

export default function CallbackClient() {
    const searchParams = useSearchParams();
    const { checkUser } = useAuth();
    // Paystack redirects with ?reference= (and legacy ?trxref=)
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    const [state, setState] = useState('verifying'); // verifying | success | pending | failed
    const [plan, setPlan] = useState(null);

    const verify = useCallback(async () => {
        if (!reference) {
            setState('failed');
            return;
        }
        setState('verifying');
        try {
            const result = await billing.verify(reference);
            if (result.status === 'success') {
                setPlan(result.plan);
                setState('success');
                // Refresh the cached user so plan-aware UI updates immediately
                if (checkUser) checkUser(true);
            } else if (result.status === 'failed' || result.status === 'abandoned') {
                setState('failed');
            } else {
                setState('pending');
            }
        } catch (err) {
            console.error('Verification failed', err);
            setState('pending');
        }
    }, [reference, checkUser]);

    useEffect(() => {
        verify();
    }, [verify]);

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {state === 'verifying' && (
                    <>
                        <div className={styles.spinner} aria-hidden="true" />
                        <h1 className={styles.title}>Confirming your payment…</h1>
                        <p className={styles.text}>This usually takes a few seconds.</p>
                    </>
                )}

                {state === 'success' && (
                    <>
                        <div className={styles.iconSuccess}>
                            <CheckCircleIcon size={36} />
                        </div>
                        <h1 className={styles.title}>
                            Welcome to {plan === 'max' ? 'Max' : 'Pro'} 🎉
                        </h1>
                        <p className={styles.text}>
                            Your new limits are live. Head back to your dashboard and put them to work.
                        </p>
                        <Link href="/dashboard" className={styles.primaryBtn}>
                            Go to dashboard
                        </Link>
                    </>
                )}

                {state === 'pending' && (
                    <>
                        <div className={styles.iconPending}>
                            <ClockIcon size={32} />
                        </div>
                        <h1 className={styles.title}>Payment still processing</h1>
                        <p className={styles.text}>
                            Your payment may still be on its way , bank confirmations can take a
                            minute. Your plan updates automatically as soon as it lands.
                        </p>
                        <button className={styles.primaryBtn} onClick={verify}>
                            Check again
                        </button>
                        <Link href="/dashboard" className={styles.secondaryLink}>
                            Back to dashboard
                        </Link>
                    </>
                )}

                {state === 'failed' && (
                    <>
                        <h1 className={styles.title}>Payment didn&apos;t go through</h1>
                        <p className={styles.text}>
                            No money left your account for this attempt. You can try again from the
                            pricing page.
                        </p>
                        <Link href="/pricing" className={styles.primaryBtn}>
                            Back to pricing
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
