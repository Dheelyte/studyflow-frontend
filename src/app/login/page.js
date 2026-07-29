import { Suspense } from 'react';
import LoginClient from './LoginClient';
import Spinner from '@/components/Spinner';

export const metadata = {
    title: 'Login',
    description: 'Log in to Primerly to continue your structured tech-skill learning path.',
};

export default function LoginPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <LoginClient />
        </Suspense>
    );
}
