// Server-side reads of the public course gallery.
// These run in server components, so they use plain fetch (no cookies) against the
// unauthenticated /gallery endpoints. Every call fails soft: if the API is unreachable
// the page renders its empty state instead of breaking the build.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

const REVALIDATE_SECONDS = 300;

export async function fetchPublicCourses({ limit = 24, offset = 0, featured = false } = {}) {
    try {
        const params = new URLSearchParams({
            limit: String(limit),
            offset: String(offset),
            featured: String(featured),
        });
        const res = await fetch(`${API_BASE}/gallery?${params.toString()}`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

export async function fetchPublicCourse(slug) {
    try {
        const res = await fetch(`${API_BASE}/gallery/${encodeURIComponent(slug)}`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

export async function fetchPublicCourseSlugs() {
    try {
        const res = await fetch(`${API_BASE}/gallery-slugs`, {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}
