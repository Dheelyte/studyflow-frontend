import { Suspense } from 'react';
import CurriculumClient from './CurriculumClient';
import Spinner from '@/components/Spinner';

export async function generateMetadata({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const topic = resolvedSearchParams?.topic;

    if (topic) {
        // Simple capitalization for better display
        const title = topic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        return {
            title: `${title}`,
        };
    }
}

export default function CurriculumPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <CurriculumClient />
        </Suspense>
    );
}
