"use client";
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, ZapIcon } from "@/components/Icons";
import CustomDropdown from '@/components/CustomDropdown';
import styles from './IntegratedSearchBar.module.css';

// Course-shape preferences live on the bar itself, so a custom course is
// generated straight from here without an intermediate form.
const DURATION_OPTIONS = [
    { value: '', label: 'Standard Duration' },
    { value: '2', label: '~2 weeks' },
    { value: '4', label: '~4 weeks' },
    { value: '6', label: '~6 weeks' },
    { value: '8', label: '~8 weeks' },
    { value: '12', label: '~12 weeks' },
];

const LEVEL_OPTIONS = [
    { value: 'beginner', label: 'Beginner', description: 'New to the topic' },
    { value: 'intermediate', label: 'Intermediate', description: 'Know the basics already' },
    { value: 'advanced', label: 'Advanced', description: 'Going deep on specifics' },
];

// Type a topic, pick its shape, generate. Browsing the public library happens
// on /explore rather than from this bar.
// `value`/`onValueChange` are optional: pass them to drive the input from
// outside (the landing hero's topic pills do). Omit them and the bar keeps its
// own state, so existing usages are unchanged.
export default function IntegratedSearchBar({
    redirect = false,
    onSearch,
    shadow = true,
    value,
    onValueChange,
    inputRef,
}) {
    const router = useRouter();
    const [internalQuery, setInternalQuery] = useState('');
    const isControlled = value !== undefined;
    const themeQuery = isControlled ? value : internalQuery;
    const [durationWeeks, setDurationWeeks] = useState('');
    const [level, setLevel] = useState('');

    const setQuery = useCallback((next) => {
        if (!isControlled) setInternalQuery(next);
        if (onValueChange) onValueChange(next);
    }, [isControlled, onValueChange]);

    const startCustomCourse = () => {
        if (!themeQuery.trim()) return;

        const params = { topic: themeQuery.trim() };
        if (durationWeeks) params.duration_weeks = durationWeeks;
        if (level) params.level = level;

        if (redirect) {
            router.push(`/curriculum?${new URLSearchParams(params).toString()}`);
        } else if (onSearch) {
            onSearch(params);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            startCustomCourse();
        }
    };

    return (
        <div className={styles.searchWrapper}>
            <div className={`${styles.integratedSearchBar} ${!shadow ? styles.noShadow : ""}`}>
                <div className={styles.inputGroup}>
                    <div className={styles.searchIconWrapper}>
                        <SearchIcon size={24} />
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.searchInput}
                        placeholder='Try "React", "SQL", or "UI/UX design"'
                        value={themeQuery}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={styles.filters}>
                    <span className={styles.filterDivider} aria-hidden />
                    <CustomDropdown
                        className={styles.filterDropdown}
                        ariaLabel="Course duration"
                        options={DURATION_OPTIONS}
                        value={durationWeeks}
                        onChange={setDurationWeeks}
                        placeholder="Any duration"
                    />
                    <span className={styles.filterDivider} aria-hidden />
                    <CustomDropdown
                        className={styles.filterDropdown}
                        ariaLabel="Experience level"
                        options={LEVEL_OPTIONS}
                        value={level}
                        onChange={setLevel}
                        placeholder="Beginner"
                    />
                </div>

                <button className={styles.searchButton} onClick={startCustomCourse}>
                    <span>Start</span>
                    <ZapIcon size={20} fill="white" />
                </button>
            </div>
        </div>
    );
}
