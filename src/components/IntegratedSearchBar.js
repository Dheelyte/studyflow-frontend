"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, ZapIcon, BookOpenIcon } from "@/components/Icons";
import { gallery } from "@/services/api";
import styles from './IntegratedSearchBar.module.css';

// Library-first: typing searches the public course gallery; generating a
// custom course is the explicit fallback row at the bottom of the dropdown.
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
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef(null);
    const debounceRef = useRef(null);
    const latestQueryRef = useRef('');

    const searchLibrary = useCallback((query) => {
        latestQueryRef.current = query;
        if (!query || query.trim().length < 2) {
            setResults([]);
            return;
        }
        gallery.list({ q: query, limit: 5 })
            .then((courses) => {
                // Ignore responses for stale queries
                if (latestQueryRef.current !== query) return;
                setResults(courses || []);
            })
            .catch(() => {
                if (latestQueryRef.current === query) setResults([]);
            });
    }, []);

    const setQuery = useCallback((next) => {
        if (!isControlled) setInternalQuery(next);
        if (onValueChange) onValueChange(next);
    }, [isControlled, onValueChange]);

    const handleChange = (next) => {
        setQuery(next);
        setActiveIndex(-1);
        setIsOpen(!!next.trim());
    };

    // Debounce off the query itself rather than off the keystroke, so a value
    // set from outside searches the library exactly like typing does.
    useEffect(() => {
        clearTimeout(debounceRef.current);
        if (themeQuery.trim().length >= 2) setIsOpen(true);
        debounceRef.current = setTimeout(() => searchLibrary(themeQuery), 300);
        return () => clearTimeout(debounceRef.current);
    }, [themeQuery, searchLibrary]);

    // Close the dropdown when clicking outside
    useEffect(() => {
        const onPointerDown = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', onPointerDown);
        return () => document.removeEventListener('mousedown', onPointerDown);
    }, []);

    const startCustomCourse = () => {
        if (!themeQuery.trim()) return;
        setIsOpen(false);

        if (redirect) {
            const queryString = new URLSearchParams({ topic: themeQuery }).toString();
            router.push(`/curriculum?${queryString}`);
        } else if (onSearch) {
            onSearch({ topic: themeQuery });
        }
    };

    const openCourse = (course) => {
        setIsOpen(false);
        router.push(`/course/${course.slug}`);
    };

    // Options: library results first, then the pinned "custom course" row.
    const optionCount = results.length + 1;

    const chooseOption = (index) => {
        if (index >= 0 && index < results.length) {
            openCourse(results[index]);
        } else {
            startCustomCourse();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isOpen && activeIndex >= 0) {
                chooseOption(activeIndex);
            } else if (results.length > 0 && isOpen) {
                // Results visible but nothing highlighted: open the top match
                chooseOption(0);
            } else {
                startCustomCourse();
            }
        } else if (e.key === 'ArrowDown' && isOpen) {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % optionCount);
        } else if (e.key === 'ArrowUp' && isOpen) {
            e.preventDefault();
            setActiveIndex((prev) => (prev <= 0 ? optionCount - 1 : prev - 1));
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const showDropdown = isOpen && themeQuery.trim().length >= 2;

    return (
        <div className={styles.searchWrapper} ref={containerRef}>
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
                        onChange={(e) => handleChange(e.target.value)}
                        onFocus={() => setIsOpen(!!themeQuery.trim())}
                        onKeyDown={handleKeyDown}
                        role="combobox"
                        aria-expanded={showDropdown}
                        aria-controls="course-search-listbox"
                        aria-autocomplete="list"
                    />
                </div>

                <button className={styles.searchButton} onClick={startCustomCourse}>
                    <span>Start</span>
                    <ZapIcon size={20} fill="white" />
                </button>
            </div>

            {showDropdown && (
                <ul className={styles.dropdown} role="listbox" id="course-search-listbox">
                    {results.map((course, idx) => (
                        <li
                            key={course.slug}
                            role="option"
                            aria-selected={activeIndex === idx}
                            className={`${styles.option} ${activeIndex === idx ? styles.optionActive : ''}`}
                            onMouseEnter={() => setActiveIndex(idx)}
                            onClick={() => openCourse(course)}
                        >
                            <div className={styles.optionIcon}>
                                <BookOpenIcon size={18} />
                            </div>
                            <div className={styles.optionInfo}>
                                <span className={styles.optionTitle}>{course.title}</span>
                                <span className={styles.optionMeta}>
                                    {course.level ? `${course.level} · ` : ''}
                                    {course.learner_count === 1
                                        ? '1 learner'
                                        : `${course.learner_count || 0} learners`}
                                </span>
                            </div>
                        </li>
                    ))}

                    <li
                        role="option"
                        aria-selected={activeIndex === results.length}
                        className={`${styles.option} ${styles.optionCustom} ${activeIndex === results.length ? styles.optionActive : ''}`}
                        onMouseEnter={() => setActiveIndex(results.length)}
                        onClick={startCustomCourse}
                    >
                        <div className={`${styles.optionIcon} ${styles.optionIconCustom}`}>
                            <ZapIcon size={18} />
                        </div>
                        <div className={styles.optionInfo}>
                            <span className={styles.optionTitle}>
                                Create a custom course on &ldquo;{themeQuery.trim()}&rdquo;
                            </span>
                            <span className={styles.optionMeta}>
                                {results.length > 0
                                    ? 'Want your own pace or focus? Generate it with AI'
                                    : 'No library match , generate it with AI'}
                            </span>
                        </div>
                    </li>
                </ul>
            )}
        </div>
    );
}
