import { Suspense } from 'react';
import CourseClient from './CourseClient';
import CourseSkeleton from '@/components/CourseSkeleton';
import { curriculum } from "@/services/api";

// Generate dynamic metadata
export async function generateMetadata({ params }) {
    // Await params for Next.js 15+
    const resolvedParams = await params;
    const id = resolvedParams.id;

    try {
        // We can optionally fetch the course title here if the API supports it efficiently.
        // If not, we might fail back to a generic title or just "Course".
        // Since 'curriculum.getCourse(id)' is available, we can try it.
        // However, we need to be careful about double fetching if not cached.
        // Next.js request duplication logic should handle it if using fetch, 
        // but our api.js uses a custom wrapper.

        // For now, let's just use a generic one or try to fetch if fast.
        // To be safe and fast, let's just say "Course". 
        // OR if we want to be fancy:
        // const course = await curriculum.getCourse(id);
        // return { title: course.title };

        // Let's stick to a generic "Course" for now to avoid server-side auth/cookie issues 
        // if the fetch requires user context (which it might).
        return {
            title: 'Course',
        };
    } catch (e) {
        return {
            title: 'Course',
        };
    }
}

export default function CoursePage({ params }) {
    return (
        <Suspense fallback={<CourseSkeleton />}>
            <CourseClient params={params} />
        </Suspense>
    );
}
