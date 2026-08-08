"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { billing } from '@/services/api';
import { PLANS, formatNaira } from '@/lib/plans';
import { CheckCircleIcon } from '@/components/Icons';
import styles from './pricing.module.css';

export default function PricingClient() {
    const { user } = useAuth();
    const router = useRouter();
    const [interval, setInterval] = useState('monthly');
    const [busyPlan, setBusyPlan] = useState(null);
    const [checkoutError, setCheckoutError] = useState(null);

    const currentPlan = user?.plan || null;

    const handleSelect = async (plan) => {
        setCheckoutError(null);

        if (plan.id === 'free') {
            router.push(user ? '/dashboard' : '/signup');
            return;
        }

        if (!user) {
            router.push(`/signup?redirect=${encodeURIComponent('/pricing')}`);
            return;
        }

        try {
            setBusyPlan(plan.id);
            const { authorization_url } = await billing.checkout(plan.id, interval);
            window.location.href = authorization_url;
        } catch (err) {
            console.error('Checkout failed', err);
            setCheckoutError(
                err.message === 'Billing is not available yet'
                    ? 'Paid plans aren’t open yet , everything stays free for now.'
                    : 'Could not start checkout. Please try again.'
            );
            setBusyPlan(null);
        }
    };

    const ctaFor = (plan) => {
        if (plan.id === currentPlan) return 'Current plan';
        if (plan.id === 'free') return currentPlan ? 'Included in your plan' : plan.cta;
        if (currentPlan === 'pro' && plan.id === 'max') return 'Upgrade to Max';
        if (currentPlan === 'max' && plan.id === 'pro') return 'Switch to Pro';
        return plan.cta;
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <span className={styles.eyebrow}>Pricing</span>
                <h1 className={styles.title}>Our Pricing Plans</h1>
                <p className={styles.subtitle}>
                    Invest in your learning journey. Choose the plan that fits your learning pace
                </p>

                <div className={styles.toggle} role="group" aria-label="Billing period">
                    <button
                        type="button"
                        className={interval === 'monthly' ? styles.toggleOn : ''}
                        onClick={() => setInterval('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        type="button"
                        className={interval === 'annual' ? styles.toggleOn : ''}
                        onClick={() => setInterval('annual')}
                    >
                        Yearly
                    </button>
                    <span className={styles.toggleSave}>2 months free</span>
                </div>
            </header>

            {checkoutError && <p className={styles.checkoutError}>{checkoutError}</p>}

            <div className={styles.plans}>
                {PLANS.map((plan) => {
                    const price = interval === 'annual' ? plan.priceAnnual : plan.priceMonthly;
                    const per = plan.priceMonthly === 0 ? 'forever' : interval === 'annual' ? '/ year' : '/ month';
                    const isCurrent = plan.id === currentPlan;

                    return (
                        <div
                            key={plan.id}
                            className={`${styles.plan} ${plan.recommended ? styles.planRecommended : ''}`}
                        >
                            {plan.recommended && <span className={styles.tab}>Recommended</span>}
                            <h2 className={styles.planName}>{plan.name}</h2>
                            <p className={styles.planTagline}>{plan.tagline}</p>

                            <div className={styles.price}>
                                <span className={styles.priceAmount}>{formatNaira(price)}</span>
                                <span className={styles.pricePer}>{per}</span>
                            </div>
                            <p className={styles.priceNote}>
                                {plan.priceMonthly === 0
                                    ? 'No card required.'
                                    : interval === 'annual'
                                        ? `≈ ${formatNaira(Math.round(plan.priceAnnual / 12))}/month · ${formatNaira(plan.priceMonthly)} billed monthly`
                                        : `${formatNaira(plan.priceAnnual)}/year , 2 months free`}
                            </p>

                            <button
                                className={`${styles.cta} ${plan.recommended ? styles.ctaPrimary : styles.ctaGhost}`}
                                onClick={() => handleSelect(plan)}
                                disabled={isCurrent || busyPlan === plan.id}
                            >
                                {busyPlan === plan.id ? 'Redirecting…' : ctaFor(plan)}
                            </button>

                            <ul className={styles.features}>
                                {plan.features.map((feature) => (
                                    <li key={feature.label} className={styles.feature}>
                                        {feature.value ? (
                                            <span className={styles.featureNum}>{feature.value}</span>
                                        ) : (
                                            <span className={styles.featureCheck}>
                                                <CheckCircleIcon size={16} />
                                            </span>
                                        )}
                                        <span>{feature.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
