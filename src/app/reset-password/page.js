"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../login/page.module.css';
import { useAuth } from '@/context/AuthContext';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyResetCode, resetPassword } = useAuth();
  
  const [step, setStep] = useState(1); // 1: Verify Code, 2: New Password
  const [email, setEmail] = useState('');
  
  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  // Handle OTP Change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle OTP KeyDown (Backspace)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Handle OTP Paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    data.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);
    // Focus last filled input
    if (data.length > 0) {
        otpRefs.current[Math.min(data.length - 1, 5)].focus();
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
        setError('Please enter a 6-digit code');
        return;
    }

    setLoading(true);
    setError('');
    
    try {
        const res = await verifyResetCode({ email, code });
        if (res.is_valid) {
            setStep(2);
        } else {
            setError('Invalid or expired code.');
        }
    } catch (err) {
        setError(err.message || 'Verification failed');
    } finally {
        setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    
    setLoading(true);
    setError('');

    try {
        await resetPassword({ email, code, new_password: newPassword });
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
        setError(err.message || 'Password reset failed');
    } finally {
        setLoading(false);
    }
  };

  if (success) {
      return (
        <div className={styles.container}>
            <div className={styles.authCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Success!</h1>
                    <p className={styles.subtitle}>Your password has been reset.</p>
                </div>
                <div style={{textAlign:'center'}}>
                    <p>Redirecting to login...</p>
                    <Link href="/login" className={styles.link}>Click here if not redirected</Link>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
            <h1 className={styles.title}>
                {step === 1 ? 'Enter Code' : 'New Password'}
            </h1>
            {step === 1 && (
                <p className={styles.subtitle}>
                    We sent a code to <span style={{fontWeight:'600'}}>{email || 'your email'}</span>
                </p>
            )}
        </div>
        
        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '1rem'}}>{error}</div>}

        {step === 1 && (
            <form className={styles.form} onSubmit={handleVerifyCode}>
                {/* Fallback if email is missing from params */}
                {!email && (
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
                )}

                <div className={styles.inputGroup}>
                    <label className={styles.label} style={{marginBottom:'12px', display:'block', textAlign:'center'}}>Secure Code</label>
                    <div style={{display:'flex', gap:'8px', justifyContent:'center'}}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={digit}
                                ref={(el) => (otpRefs.current[index] = el)}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                onPaste={index === 0 ? handleOtpPaste : undefined} // Only allow paste on first input
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    textAlign: 'center',
                                    fontSize: '1.2rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--card-bg)',
                                    color: 'var(--foreground)',
                                    outline: 'none',
                                    // Highlight focused
                                    boxShadow: 'none'
                                }}
                                className={styles.otpInput} // Use a class if we want focus styles via CSS
                            />
                        ))}
                    </div>
                </div>

                <style jsx>{`
                    input:focus {
                        border-color: var(--primary) !important;
                        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
                    }
                `}</style>

                <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                
                 <div className={styles.footer} style={{marginTop:'16px'}}>
                    <p style={{fontSize:'0.85rem', color:'var(--muted-foreground)'}}>
                        Didn't receive it? <Link href="/forgot-password" className={styles.link}>Resend</Link>
                    </p>
                 </div>
            </form>
        )}

        {step === 2 && (
            <form className={styles.form} onSubmit={handleResetPassword}>
                <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="newPassword">New Password</label>
                    <input 
                        type="password" 
                        id="newPassword" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 chars, 1 Upper, 1 Lower, 1 Number" 
                        className={styles.input} 
                        required 
                        minLength={8}
                    />
                </div>
                <button type="submit" className={styles.primaryButton} disabled={loading}>
                    {loading ? 'Reset Password' : 'Confirm New Password'}
                </button>
            </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
