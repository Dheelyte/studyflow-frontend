import { Suspense } from 'react';
import SignupClient from './SignupClient';
import Spinner from '@/components/Spinner';

export const metadata = {
    title: 'Sign Up',
    description: 'Create a free Primerly account and turn YouTube into a structured tech course with an AI tutor, quizzes, and a verifiable certificate.',
};

export default function SignupPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
            <SignupClient />
        </Suspense>
    );
}
