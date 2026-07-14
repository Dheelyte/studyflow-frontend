import React from 'react';
import Image from 'next/image';
import styles from './LoadingLogo.module.css';

export default function LoadingLogo({ size = 28, className }) {
  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.logo}>
        <Image src="/Primerly Logo.png" alt="Primerly" width={size} height={size} priority />
      </div>
    </div>
  );
}
