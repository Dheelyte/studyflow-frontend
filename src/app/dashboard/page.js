import { Suspense } from 'react';
import DashboardClient from './DashboardClient';
import Spinner from '@/components/Spinner';

export const metadata = {
    title: 'Dashboard',
};

export default function DashboardPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <DashboardClient />
        </Suspense>
    );
}