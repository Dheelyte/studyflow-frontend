"use client";
import styles from './MobileHeader.module.css';
import { ZapIcon } from "./Icons";

import Link from 'next/link';

export default function MobileHeader({ onMenuClick }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
        <ZapIcon size={24} fill="var(--primary)" /> Primerly
      </Link>
      <div style={{ display: 'flex', alignItems: 'center' }}>

      </div>
    </header>
  );
}
