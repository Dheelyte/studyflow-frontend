"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Card from './Card';
import styles from './CourseMarquee.module.css';

// Enough cards to span a wide viewport before the set is duplicated for looping.
const MIN_ITEMS_BEFORE_LOOP = 8;

// Same palette the library grid cycles through, so published courses and your own
// courses read as the same kind of thing.
const CARD_GRADIENTS = [
    'linear-gradient(135deg, #6366f1, #a855f7)',
    'linear-gradient(135deg, #3b82f6, #06b6d4)',
    'linear-gradient(135deg, #10b981, #34d399)',
    'linear-gradient(135deg, #f59e0b, #fbbf24)',
    'linear-gradient(135deg, #ec4899, #f472b6)',
];

function plural(count, word) {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function buildMeta(course) {
    const parts = [];
    if (course.module_count > 0) parts.push(plural(course.module_count, 'module'));
    if (course.lesson_count > 0) parts.push(plural(course.lesson_count, 'lesson'));
    return parts.join(' • ');
}

export default function CourseMarquee({ courses = [], speedSeconds = 60 }) {
    const containerRef = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        if (typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    if (courses.length === 0) return null;

    // Colour is keyed to the course's own position so a given course keeps the same
    // gradient in every repetition.
    const base = [];
    while (base.length < MIN_ITEMS_BEFORE_LOOP) {
        courses.forEach((course, index) => {
            base.push({ course, color: CARD_GRADIENTS[index % CARD_GRADIENTS.length] });
        });
    }
    const items = [...base, ...base];

    return (
        <div className={styles.container} ref={containerRef}>
            <div
                className={`${styles.track} ${inView ? styles.running : ''}`}
                style={{ animationDuration: `${speedSeconds}s` }}
            >
                {items.map(({ course, color }, i) => (
                    <Link
                        href={`/course/${course.slug}`}
                        className={styles.item}
                        key={`${course.slug}-${i}`}
                        aria-hidden={i >= base.length ? true : undefined}
                        tabIndex={i >= base.length ? -1 : undefined}
                    >
                        <Card
                            title={course.title}
                            level={course.level}
                            color={color}
                            meta={buildMeta(course)}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}
