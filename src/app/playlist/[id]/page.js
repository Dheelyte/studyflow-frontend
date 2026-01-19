import { Suspense } from 'react';
import PlaylistClient from './PlaylistClient';
import PlaylistSkeleton from '@/components/PlaylistSkeleton';
import { curriculum } from "@/services/api";

// Generate dynamic metadata
export async function generateMetadata({ params }) {
    // Await params for Next.js 15+
    const resolvedParams = await params;
    const id = resolvedParams.id;

    try {
        // We can optionally fetch the playlist title here if the API supports it efficiently.
        // If not, we might fail back to a generic title or just "Playlist".
        // Since 'curriculum.get(id)' is available, we can try it.
        // However, we need to be careful about double fetching if not cached.
        // Next.js request duplication logic should handle it if using fetch, 
        // but our api.js uses a custom wrapper.

        // For now, let's just use a generic one or try to fetch if fast.
        // To be safe and fast, let's just say "Playlist". 
        // OR if we want to be fancy:
        // const playlist = await curriculum.get(id);
        // return { title: playlist.title };

        // Let's stick to "Curriculum" for now to avoid server-side auth/cookie issues 
        // if the fetch requires user context (which it might).
        return {
            title: 'Curriculum',
        };
    } catch (e) {
        return {
            title: 'Curriculum',
        };
    }
}

export default function PlaylistPage({ params }) {
    return (
        <Suspense fallback={<PlaylistSkeleton />}>
            <PlaylistClient params={params} />
        </Suspense>
    );
}
