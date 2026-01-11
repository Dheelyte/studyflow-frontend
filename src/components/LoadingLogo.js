import React from 'react';
import { ZapIcon } from './Icons';
import styles from './LoadingLogo.module.css';

export default function LoadingLogo({ size = 28, className }) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.logo}>
        <ZapIcon size={size} fill="var(--primary)" />
      </div>
    </div>
  );
}
