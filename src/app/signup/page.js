import { Suspense } from 'react';
import SignupClient from './SignupClient';
import Spinner from '@/components/Spinner';

export const metadata = {
    title: 'Sign Up',
};

export default function SignupPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <SignupClient />
        </Suspense>
    );
}
