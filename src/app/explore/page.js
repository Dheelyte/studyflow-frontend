import Link from 'next/link';
import CourseGalleryCard from '@/components/CourseGalleryCard';
import { fetchPublicCourses } from '@/lib/gallery-server';
import styles from './page.module.css';

export const metadata = {
    title: 'Explore Courses',
    description:
        'Browse structured tech courses published by the Primerly community — coding, data, design, cloud and more, each with an AI tutor, quizzes, and a certificate.',
};

export const revalidate = 300;

export default async function ExplorePage() {
    const courses = await fetchPublicCourses({ limit: 48 });

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>Explore courses</h1>
                <p className={styles.subtitle}>
                    Structured tech paths published by Primerly learners. Start any of them and
                    your progress, quizzes, and certificate are your own.
                </p>
            </header>

            {courses.length > 0 ? (
                <div className={styles.grid}>
                    {courses.map((course) => (
                        <CourseGalleryCard key={course.slug} course={course} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <h2 className={styles.emptyTitle}>No published courses yet</h2>
                    <p className={styles.emptyText}>
                        Nobody has published a course to the gallery yet. Build one for the tech
                        skill you want to learn, and you can publish it here when it's ready.
                    </p>
                    <Link href="/signup" className={styles.emptyCta}>
                        Build your first course
                    </Link>
                </div>
            )}
        </div>
    );
}
