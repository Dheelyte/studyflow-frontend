import React from 'react';
import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
    return (
        <div className={styles.skeletonCard}>
            <div className={`${styles.skeletonBlock} ${styles.title}`}></div>
            <div className={`${styles.skeletonBlock} ${styles.description}`}></div>
            <div className={`${styles.skeletonBlock} ${styles.description}`} style={{ width: '60%' }}></div>
            <div className={styles.spacer}></div>
            <div className={`${styles.skeletonBlock} ${styles.footer}`}></div>
        </div>
    );
};

export default SkeletonCard;