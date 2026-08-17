"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, ZapIcon, SlidersIcon } from "@/components/Icons";
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
    // Collapsed by default: the point of the button is to say these exist and
    // are optional, rather than putting two more controls in everyone's way.
    const [customizeOpen, setCustomizeOpen] = useState(false);
    // Opens upward when the window is too short for it to sit below the bar,
    // which is common on laptop heights and would otherwise leave the last
    // field under the fold.
    const [dropUp, setDropUp] = useState(false);
    const customizeRef = useRef(null);
    const customizeButtonRef = useRef(null);

    const customCount = (durationWeeks ? 1 : 0) + (level ? 1 : 0);

    useEffect(() => {
        if (!customizeOpen) return;

        const onPointerDown = (e) => {
            if (customizeRef.current && !customizeRef.current.contains(e.target)) {
                setCustomizeOpen(false);
            }
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setCustomizeOpen(false);
        };

        document.addEventListener('mousedown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('mousedown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [customizeOpen]);

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
                        placeholder='Try Cloud computing, Video Editing, or UI/UX design'
                        value={themeQuery}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className={styles.filters} ref={customizeRef}>
                    <span className={styles.filterDivider} aria-hidden />
                    <button
                        type="button"
                        ref={customizeButtonRef}
                        className={`${styles.customizeButton} ${customizeOpen || customCount ? styles.customizeActive : ''}`}
                        onClick={() => {
                            setCustomizeOpen((open) => {
                                if (!open) {
                                    const rect = customizeButtonRef.current?.getBoundingClientRect();
                                    // Panel is ~215px tall plus its 14px offset.
                                    setDropUp(!!rect && window.innerHeight - rect.bottom < 250);
                                }
                                return !open;
                            });
                        }}
                        aria-expanded={customizeOpen}
                        aria-haspopup="true"
                    >
                        <SlidersIcon size={18} />
                        <span>Customize</span>
                        {customCount > 0 && <span className={styles.customizeCount}>{customCount}</span>}
                    </button>

                    {customizeOpen && (
                        <div className={`${styles.customizePanel} ${dropUp ? styles.customizePanelAbove : ''}`}>
                            <div className={styles.customizeHeader}>
                                <span className={styles.customizeTitle}>Customize your course</span>
                                <span className={styles.customizeOptional}>Optional</span>
                            </div>

                            {/* Plain divs, not <label>: the dropdown is a button, and a
                                label forwards clicks on its children to that button ,
                                which would reopen the menu the moment an option closed
                                it. The accessible name comes from ariaLabel instead. */}
                            <div className={styles.customizeField}>
                                <span className={styles.customizeLabel}>Learning duration</span>
                                <CustomDropdown
                                    className={styles.panelDropdown}
                                    ariaLabel="Learning duration"
                                    options={DURATION_OPTIONS}
                                    value={durationWeeks}
                                    onChange={setDurationWeeks}
                                    placeholder="Standard Duration"
                                />
                            </div>

                            <div className={styles.customizeField}>
                                <span className={styles.customizeLabel}>Experience level</span>
                                <CustomDropdown
                                    className={styles.panelDropdown}
                                    ariaLabel="Experience level"
                                    options={LEVEL_OPTIONS}
                                    value={level}
                                    onChange={setLevel}
                                    placeholder="Beginner"
                                />
                            </div>

                            {customCount > 0 && (
                                <button
                                    type="button"
                                    className={styles.customizeReset}
                                    onClick={() => { setDurationWeeks(''); setLevel(''); }}
                                >
                                    Reset to default
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <button className={styles.searchButton} onClick={startCustomCourse}>
                    <span>Start</span>
                    <ZapIcon size={20} fill="white" />
                </button>
            </div>
        </div>
    );
}
