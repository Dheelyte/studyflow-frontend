"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, ZapIcon } from "@/components/Icons";
import styles from './IntegratedSearchBar.module.css';

export default function IntegratedSearchBar({ redirect = false, onSearch, shadow = true }) {
    const router = useRouter();
    const [themeQuery, setQuery] = useState('');

    const handleStart = () => {
        if (!themeQuery.trim()) return;

        if (redirect) {
            const query = { topic: themeQuery };
            const queryString = new URLSearchParams(query).toString();
            router.push(`/curriculum?${queryString}`);
        } else if (onSearch) {
            onSearch({ topic: themeQuery });
        }
    };

    return (
        <div className={`${styles.integratedSearchBar} ${!shadow ? styles.noShadow : ""}`}>
            <div className={styles.inputGroup}>
                <div className={styles.searchIconWrapper}>
                    <SearchIcon size={24} />
                </div>

                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder='Try "React", "SQL", or "UI/UX design"'
                    value={themeQuery}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
            </div>

            <button className={styles.searchButton} onClick={handleStart}>
                <span>Start</span>
                <ZapIcon size={20} fill="white" />
            </button>
        </div>
    );
}
