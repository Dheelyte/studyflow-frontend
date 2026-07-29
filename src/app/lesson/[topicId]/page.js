import { Suspense } from 'react';
import TutorClient from './TutorClient';

export async function generateMetadata() {
    return {
        title: 'Lesson',
    };
}

function TutorSkeleton() {
    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)', padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                    <div style={{ width: '200px', height: '24px', borderRadius: '8px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 640px', aspectRatio: '16/9', borderRadius: '16px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                    <div style={{ flex: '1 1 300px', minHeight: '300px', borderRadius: '16px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                </div>
            </div>
        </div>
    );
}

export default function TutorPage({ params }) {
    return (
        <Suspense fallback={<TutorSkeleton />}>
            <TutorClient params={params} />
        </Suspense>
    );
}
