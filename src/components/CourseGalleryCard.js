import Link from 'next/link';
import styles from './CourseGalleryCard.module.css';

function plural(count, word) {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
}

export default function CourseGalleryCard({ course }) {
    const {
        slug,
        title,
        description,
        level,
        module_count: moduleCount = 0,
        topic_count: topicCount = 0,
        learner_count: learnerCount = 0,
        author_name: authorName,
        is_featured: isFeatured,
    } = course;

    return (
        <Link href={`/course/${slug}`} className={styles.card}>
            {isFeatured ? (
                <span className={styles.featuredBadge}>Featured</span>
            ) : (
                <div className={styles.accent} aria-hidden />
            )}

            <h3 className={styles.title}>{title}</h3>

            {description && <p className={styles.description}>{description}</p>}

            {authorName && <span className={styles.author}>by {authorName}</span>}

            <div className={styles.meta}>
                {level && <span>{level}</span>}
                <span>{plural(moduleCount, 'module')}</span>
                <span>{plural(topicCount, 'topic')}</span>
                {learnerCount > 0 && <span>{plural(learnerCount, 'learner')}</span>}
            </div>
        </Link>
    );
}
