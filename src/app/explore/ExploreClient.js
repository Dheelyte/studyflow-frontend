"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CourseGalleryCard from '@/components/CourseGalleryCard';
import { SearchIcon } from '@/components/Icons';
import { gallery } from '@/services/api';
import styles from './page.module.css';

export default function ExploreClient({ initialCourses }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null); // null = showing the default grid
    const [searching, setSearching] = useState(false);
    const debounceRef = useRef(null);
    const latestQueryRef = useRef('');

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    const handleChange = (value) => {
        setQuery(value);
        clearTimeout(debounceRef.current);

        const q = value.trim();
        if (q.length < 2) {
            latestQueryRef.current = '';
            setResults(null);
            setSearching(false);
            return;
        }

        setSearching(true);
        debounceRef.current = setTimeout(() => {
            latestQueryRef.current = q;
            gallery.list({ q, limit: 48 })
                .then((courses) => {
                    if (latestQueryRef.current !== q) return;
                    setResults(courses || []);
                })
                .catch(() => {
                    if (latestQueryRef.current === q) setResults([]);
                })
                .finally(() => {
                    if (latestQueryRef.current === q) setSearching(false);
                });
        }, 300);
    };

    const courses = results ?? initialCourses;

    return (
        <>
            <div className={styles.searchBox}>
                <SearchIcon size={20} />
                <input
                    type="search"
                    className={styles.searchInput}
                    placeholder="Search courses , e.g. React, SQL, UI/UX"
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    aria-label="Search courses"
                />
            </div>

            {courses.length > 0 ? (
                <div className={styles.grid}>
                    {courses.map((course) => (
                        <CourseGalleryCard key={course.slug} course={course} />
                    ))}
                </div>
            ) : results !== null && !searching ? (
                <div className={styles.emptyState}>
                    <h2 className={styles.emptyTitle}>No courses match &ldquo;{query.trim()}&rdquo;</h2>
                    <p className={styles.emptyText}>
                        Nobody has published a course on that yet , but you can generate a custom
                        one with AI and be the first to publish it.
                    </p>
                    <Link
                        href={`/curriculum?topic=${encodeURIComponent(query.trim())}`}
                        className={styles.emptyCta}
                    >
                        Create a custom course
                    </Link>
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h2 className={styles.emptyTitle}>No published courses yet</h2>
                    <p className={styles.emptyText}>
                        Nobody has published a course to the gallery yet. Build one for the tech
                        skill you want to learn, and you can publish it here when it&apos;s ready.
                    </p>
                    <Link href="/signup" className={styles.emptyCta}>
                        Build your first course
                    </Link>
                </div>
            )}
        </>
    );
}
