import { SITE_URL } from '@/lib/site';

export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            // /course/ is deliberately crawlable: it is the canonical URL for public
            // courses. Private ones emit noindex from their own metadata.
            disallow: [
                '/curriculum',
                '/dashboard',
                '/library',
                '/profile',
                '/lesson/',
                '/reset-password',
                '/forgot-password',
            ],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
