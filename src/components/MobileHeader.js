"use client";
import styles from './MobileHeader.module.css';
import { MenuIcon, ZapIcon } from './Icons';
import Link from 'next/link';

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} style={{textDecoration: 'none'}}>
        <ZapIcon size={24} fill="var(--primary)" /> StudyFlow
      </Link>
      <button className={styles.menuButton} onClick={onMenuClick}>
        <MenuIcon size={28} />
      </button>
    </header>
  );
}
