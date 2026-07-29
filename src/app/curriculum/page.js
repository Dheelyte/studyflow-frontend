import { Suspense } from 'react';
import CurriculumClient from './CurriculumClient';
import Spinner from '@/components/Spinner';

export async function generateMetadata({ searchParams }) {
    const resolvedSearchParams = await searchParams;
    const rawTopic = resolvedSearchParams?.topic || '';

    // The topic is raw user input headed for <title>: strip to plain characters and cap length.
    const topic = rawTopic.replace(/[^\w\s.+#&-]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);

    const title = topic
        ? topic.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Curriculum';

    return {
        title,
        robots: { index: false },
    };
}

export default function CurriculumPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <CurriculumClient />
        </Suspense>
    );
}
