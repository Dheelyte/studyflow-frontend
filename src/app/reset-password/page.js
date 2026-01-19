import { Suspense } from 'react';
import ResetPasswordClient from './ResetPasswordClient';
import LoadingLogo from '@/components/LoadingLogo';

export const metadata = {
    title: 'Reset Password',
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}><LoadingLogo /></div>}>
            <ResetPasswordClient />
        </Suspense>
    );
}
