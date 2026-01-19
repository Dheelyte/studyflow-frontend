import { Suspense } from 'react';
import CommunityClient from './CommunityClient';
import Spinner from '@/components/Spinner';

export const metadata = {
    title: 'Community',
};

export default function CommunityPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <CommunityClient />
        </Suspense>
    );
}
