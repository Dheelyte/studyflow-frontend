"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleIcon, GitHubIcon } from "@/components/Icons";
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Get values directly from form elements
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    try {
        await login({ email, password });
        router.push('/dashboard');
    } catch (err) {
        setError(err.message || 'Login failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '16px'}}>
                 <Link href="/" className={styles.logoLink} style={{display:'flex', alignItems:'center', gap:'8px', textDecoration:'none'}}>
                    <div style={{width:'32px', height:'32px', background:'var(--primary)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    </div>
                    <span style={{fontWeight:'700', fontSize:'1.2rem', color:'var(--foreground)'}}>StudyFlow</span>
                 </Link>
            </div>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to continue your flow</p>
        </div>

        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</div>}

        {!showEmailForm ? (
            <div className={styles.socialButtons}>
                <button className={styles.socialButton} type="button">
                    <GoogleIcon size={20} />
                    Continue with Google
                </button>
                <button className={styles.socialButton} type="button">
                    <GitHubIcon size={20} />
                    Continue with GitHub
                </button>
                 <button className={styles.socialButton} type="button" onClick={() => setShowEmailForm(true)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    Continue with Email
                </button>
            </div>
        ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
                <div style={{marginBottom: '16px'}}>
                    <button 
                        type="button" 
                        onClick={() => setShowEmailForm(false)}
                        style={{background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', color:'var(--foreground-muted)', fontSize:'0.9rem'}}
                    >
                        ← Back to options
                    </button>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        placeholder="you@example.com" 
                        className={styles.input} 
                        required 
                    />
                </div>
                
                <div className={styles.inputGroup}>
                    <div style={{display:'flex', justifyContent:'space-between'}}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <Link href="/forgot-password" className={styles.link} style={{fontSize:'0.85rem'}}>Forgot?</Link>
                    </div>
                    <input 
                        type="password" 
                        id="password" 
                        name="password"
                        placeholder="••••••••" 
                        className={styles.input} 
                        required 
                    />
                </div>

                <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        )}

        <div className={styles.footer}>
            Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
