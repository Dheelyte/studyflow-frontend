import { Suspense } from 'react';
import CourseClient from './CourseClient';
import CourseSkeleton from '@/components/CourseSkeleton';
import { fetchPublicCourse } from '@/lib/gallery-server';
import { SITE_URL, SITE_NAME } from '@/lib/site';

// Published courses are fetched server-side so this single route stays indexable.
// Private ones return null here and render the authenticated view only.
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const course = await fetchPublicCourse(slug);

    if (!course) {
        return { title: 'Course', robots: { index: false } };
    }

    const description =
        course.description?.slice(0, 300) ||
        `A structured ${course.title} course built from the best YouTube videos, with an AI tutor and quizzes.`;

    return {
        title: course.title,
        description,
        alternates: { canonical: `${SITE_URL}/course/${course.slug}` },
        openGraph: {
            title: `${course.title} | ${SITE_NAME}`,
            description,
            url: `${SITE_URL}/course/${course.slug}`,
            type: 'article',
        },
    };
}

export default async function CoursePage({ params }) {
    const { slug } = await params;
    const publicCourse = await fetchPublicCourse(slug);

    const courseJsonLd = publicCourse && {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: publicCourse.title,
        description: publicCourse.description || undefined,
        url: `${SITE_URL}/course/${publicCourse.slug}`,
        inLanguage: 'en',
        provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        offers: {
            '@type': 'Offer',
            price: 0,
            priceCurrency: 'USD',
            category: 'Free',
            availability: 'https://schema.org/InStock',
        },
        hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: 'online',
            courseWorkload: `PT${Math.max(publicCourse.topic_count, 1)}H`,
        },
    };

    return (
        <>
            {courseJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
                />
            )}
            <Suspense fallback={<CourseSkeleton />}>
                <CourseClient params={params} publicCourse={publicCourse} />
            </Suspense>
        </>
    );
}
