"use client";
import styles from './MobileHeader.module.css';
import Image from 'next/image';
import Link from 'next/link';
import PlanBadge from './PlanBadge';

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
        <Image src="/Primerly Logo.png" alt="Primerly" width={24} height={24} priority />
        Primerly
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PlanBadge />
      </div>
    </header>
  );
}
