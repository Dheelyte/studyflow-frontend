"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../login/page.module.css'; // Reusing login styles
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from '@/components/Icons';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestPasswordReset(email);
      // Redirect to reset password page with email param
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
            <button onClick={() => router.back()} style={{background:'none', border:'none', cursor:'pointer', marginBottom:'16px', display:'flex', alignItems:'center', color:'var(--foreground)'}}>
                <ChevronLeft size={20} /> Back
            </button>
            <h1 className={styles.title}>Reset Password</h1>
            <p className={styles.subtitle}>Enter your email to receive instructions</p>
        </div>

        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    className={styles.input} 
                    required 
                />
            </div>

            <button type="submit" className={styles.primaryButton} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
        </form>
        
        <div className={styles.footer}>
             <Link href="/reset-password" className={styles.link}>I already have a code</Link>
        </div>

      </div>
    </div>
  );
}
