"use client";
import React from 'react';
import styles from './Toast.module.css';
import { useToast } from '@/context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className={styles.closeButton}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
