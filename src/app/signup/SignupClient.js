"use client";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GoogleIcon, GitHubIcon } from "@/components/Icons";
import { API_URL } from '@/services/api';
import styles from '../login/page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

export default function SignupClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');
    const { register, checkUser, user, loading: authLoading } = useAuth();
    const { addToast } = useToast();

    useEffect(() => {
        if (!authLoading && user) {
            router.push(redirect || '/dashboard');
        }
    }, [user, authLoading, router, redirect]);

    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // flow state: 'social' -> 'names' -> 'credentials'
    const [step, setStep] = useState('social');

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    const handleSocialClick = () => {
        // For now just move to email flow for manual entry demonstration
        setStep('names');
    };

    const handleNameSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (formData.first_name && formData.last_name) {
            setStep('credentials');
        }
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        setLoading(true);

        try {
            // 1. Register (Server now sets HTTP-only cookie on success)
            await register(formData);

            // 2. Sync user state (optional, but good practice if the cookie is ready)
            // Alternatively, the dashboard protection will handle this check.
            await checkUser(true);

            // 3. Redirect to Dashboard
            router.push(redirect || '/dashboard');
        } catch (err) {
            if (err.validationErrors) {
                setValidationErrors(err.validationErrors);
                if (err.validationErrors.first_name || err.validationErrors.last_name) {
                    setStep('names');
                    addToast('Please correct your details.', 'error');
                } else {
                    addToast('Please check the highlighted fields.', 'error');
                }
            } else {
                addToast(err.message || 'Signup failed', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                        <Link href="/" className={styles.logoLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                            </div>
                            <span style={{ fontWeight: '700', fontSize: '1.2rem', color: 'var(--foreground)' }}>Primerly</span>
                        </Link>
                    </div>
                    <h1 className={styles.title}>Create Account</h1>

                </div>



                {step === 'social' && (
                    <div className={styles.socialButtons}>
                        <a href={`${API_URL}/auth/login/google`} className={styles.socialButton} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <GoogleIcon size={20} />
                            Sign up with Google
                        </a>
                        <a href={`${API_URL}/auth/login/github`} className={styles.socialButton} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <GitHubIcon size={20} />
                            Sign up with GitHub
                        </a>
                        <button className={styles.socialButton} type="button" onClick={handleSocialClick}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            Sign up with Email
                        </button>
                    </div>
                )}

                {step === 'names' && (
                    <form className={styles.form} onSubmit={handleNameSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <button
                                type="button"
                                onClick={() => setStep('social')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--foreground-muted)', fontSize: '0.9rem' }}
                            >
                                ← Back
                            </button>
                        </div>


                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="first_name">First Name</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="e.g. Alex"
                                className={styles.input}
                                required
                                autoFocus
                            />
                            {validationErrors.first_name && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{validationErrors.first_name}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="last_name">Last Name</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="e.g. Johnson"
                                className={styles.input}
                                required
                            />
                            {validationErrors.last_name && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{validationErrors.last_name}</div>}
                        </div>

                        <button type="submit" className={styles.primaryButton}>
                            Continue
                        </button>
                    </form>
                )}

                {step === 'credentials' && (
                    <form className={styles.form} onSubmit={handleFinalSubmit}>
                        <div style={{ marginBottom: '16px' }}>
                            <button
                                type="button"
                                onClick={() => setStep('names')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--foreground-muted)', fontSize: '0.9rem' }}
                            >
                                ← Back
                            </button>
                        </div>


                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className={styles.input}
                                required
                                autoFocus
                            />
                            {validationErrors.email && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{validationErrors.email}</div>}
                            {validationErrors.first_name && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{validationErrors.first_name}</div>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                className={styles.input}
                                required
                            />
                            {validationErrors.password && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '4px' }}>{validationErrors.password}</div>}
                        </div>

                        <button type="submit" className={styles.primaryButton} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    Already have an account? {/* Dynamic link based on redirect */}
                    <Link href={redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/login"} className={styles.link}>Log in</Link>
                </div>
            </div>
        </div>
    );
}
