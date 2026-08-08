import { SITE_URL } from '@/lib/site';
import { fetchPublicCourseSlugs } from '@/lib/gallery-server';

export default async function sitemap() {
    const routes = [
        { path: '', priority: 1 },
        { path: '/explore', priority: 0.9 },
        { path: '/pricing', priority: 0.9 },
        { path: '/about', priority: 0.8 },
        { path: '/contact', priority: 0.5 },
        { path: '/login', priority: 0.5 },
        { path: '/signup', priority: 0.8 },
        { path: '/privacy-policy', priority: 0.3 },
        { path: '/terms-of-service', priority: 0.3 },
        { path: '/cookie-policy', priority: 0.3 },
    ];

    const staticEntries = routes.map(({ path, priority }) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority,
    }));

    const courses = await fetchPublicCourseSlugs();
    const courseEntries = courses.map(({ slug, published_at: publishedAt }) => ({
        url: `${SITE_URL}/course/${slug}`,
        lastModified: publishedAt ? new Date(publishedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    return [...staticEntries, ...courseEntries];
}
