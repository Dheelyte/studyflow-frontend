import { Suspense } from 'react';
import ProfileClient from './ProfileClient';
import Spinner from '@/components/Spinner';

export const metadata = {
    title: 'Profile',
};

export default function ProfilePage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <ProfileClient />
        </Suspense>
    );
}
