import { fetchPublicCourses } from '@/lib/gallery-server';
import ExploreClient from './ExploreClient';
import styles from './page.module.css';

export const metadata = {
    title: 'Explore Courses',
    description:
        'Browse structured tech courses published by the Primerly community , coding, data, design, cloud and more, each with an AI tutor, quizzes, and a certificate.',
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

            <ExploreClient initialCourses={courses} />
        </div>
    );
}
