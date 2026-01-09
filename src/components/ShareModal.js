"use client";
import React, { useState } from 'react';
import styles from './ShareModal.module.css';
import { XIcon, CheckIcon, ShareIcon } from '@/components/Icons';

export default function ShareModal({ onClose, url, title, heading = "Share this Playlist" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareLinks = [
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, color: '#1DA1F2' },
    { name: 'LinkedIn', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, color: '#0A66C2' },
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, color: '#1877F2' }
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
            <div className={styles.iconWrapper}>
                <ShareIcon size={20} />
            </div>
            <h2 className={styles.title}>{heading}</h2>
            <button className={styles.closeBtn} onClick={onClose}>
                <XIcon size={20} />
            </button>
        </div>
        
        <div className={styles.content}>
            <p className={styles.subtitle}>Share this learning path with your friends and colleagues.</p>
            
            <div className={styles.inputGroup}>
                <input 
                    className={styles.input} 
                    value={url} 
                    readOnly 
                />
                <button 
                    className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} 
                    onClick={handleCopy}
                >
                    {copied ? <CheckIcon size={18} /> : 'Copy'}
                </button>
            </div>

            <div className={styles.divider}>Or share via</div>

            <div className={styles.socialGrid}>
                {shareLinks.map(social => (
                    <a 
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.socialBtn}
                        style={{ '--hover-color': social.color }}
                    >
                        {social.name}
                    </a>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
