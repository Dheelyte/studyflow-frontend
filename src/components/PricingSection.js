"use client";
import { useState } from 'react';
import Link from 'next/link';
import { PLANS, formatNaira } from '@/lib/plans';
import { CheckCircleIcon } from '@/components/Icons';
import styles from './PricingSection.module.css';

// Compact pricing cards for the landing page , the full detail lives at /pricing.
export default function PricingSection() {
    const [interval, setInterval] = useState('monthly');

    return (
        <section id="pricing" className={styles.section}>
            <h2 className={styles.heading}>Pricing Plans</h2>
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

            <div className={styles.plans}>
                {PLANS.map((plan) => {
                    const price = interval === 'annual' ? plan.priceAnnual : plan.priceMonthly;
                    const per = plan.priceMonthly === 0 ? 'forever' : interval === 'annual' ? '/ year' : '/ month';
                    return (
                        <div
                            key={plan.id}
                            className={`${styles.plan} ${plan.recommended ? styles.planRecommended : ''}`}
                        >
                            {plan.recommended && <span className={styles.tab}>Recommended</span>}
                            <h3 className={styles.planName}>{plan.name}</h3>
                            <div className={styles.price}>
                                <span className={styles.priceAmount}>{formatNaira(price)}</span>
                                <span className={styles.pricePer}>{per}</span>
                            </div>
                            <ul className={styles.features}>
                                {plan.features.slice(0, 4).map((feature) => (
                                    <li key={feature.label} className={styles.feature}>
                                        {feature.value ? (
                                            <span className={styles.featureNum}>{feature.value}</span>
                                        ) : (
                                            <span className={styles.featureCheck}>
                                                <CheckCircleIcon size={15} />
                                            </span>
                                        )}
                                        <span>{feature.label}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/pricing"
                                className={`${styles.cta} ${plan.recommended ? styles.ctaPrimary : styles.ctaGhost}`}
                            >
                                {plan.id === 'free' ? 'Start free' : `See ${plan.name} details`}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
