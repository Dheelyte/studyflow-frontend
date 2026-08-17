import HomeClient from './HomeClient';
import { faqs } from '@/lib/faq';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { fetchPublicCourses } from '@/lib/gallery-server';

export const revalidate = 300;

export const metadata = {
    title: 'Primerly | Learn in-demand tech skills with your personal AI Tutor',
    description:
        'Primerly builds a personalised & structured course from the best YouTube videos, with an AI tutor, quizzes, practice projects, and a community to keep you consistent.',
};

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/Primerly%20Logo.png`,
    sameAs: [
        'https://x.com/primerlyapp',
        'https://www.linkedin.com/company/primerly/',
    ],
};

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
        },
    })),
};

export default async function HomePage() {
    // Prefer hand-picked courses; fall back to the newest published ones so the section
    // still has something real to show before anything has been featured.
    let featuredCourses = await fetchPublicCourses({ limit: 6, featured: true });
    if (featuredCourses.length === 0) {
        featuredCourses = await fetchPublicCourses({ limit: 6 });
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <HomeClient featuredCourses={featuredCourses} />
        </>
    );
}
