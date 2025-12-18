"use client";
import styles from './TopBar.module.css';
import { ChevronLeft, ChevronRight } from './Icons';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
// Theme use removed from here

export default function TopBar() {
  const router = useRouter();
  const { user, logout } = useAuth();
 
  return (
    <header className={styles.topbar}>
      <div className={styles.navigationButtons}>
        <button onClick={() => router.back()} className={styles.navButton} title="Go back">
          <ChevronLeft />
        </button>
        <button onClick={() => router.forward()} className={styles.navButton} title="Go forward">
          <ChevronRight />
        </button>
      </div>
      <div className={styles.authButtons}>
        
        {/* Toggle removed from here, back to sidebar */}

        {user ? (
            <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                <span style={{fontSize:'0.9rem', fontWeight:'600'}}>Hi, {user.first_name || 'User'}</span>
                <button className={styles.login} onClick={logout}>Log out</button>
            </div>
        ) : (
            <>
                <Link href="/signup" className={styles.signup}>Sign up</Link>
                <Link href="/login" className={styles.login}>Log in</Link>
            </>
        )}
      </div>
    </header>
  );
}
