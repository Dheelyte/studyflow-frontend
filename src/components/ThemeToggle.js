"use client";
import React from 'react';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from './Icons';
import styles from './ThemeToggle.module.css';

const SystemIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  return (
    <button 
      className={styles.toggleButton} 
      onClick={toggleTheme}
      title={`Switch to ${theme === 'light' ? 'Dark' : theme === 'dark' ? 'System' : 'Light'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <MoonIcon size={20} /> : theme === 'dark' ? <SystemIcon size={20} /> : <SunIcon size={20} />}
    </button>
  );
}
