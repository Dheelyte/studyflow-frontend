import { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export const metadata = {
    title: 'Confirming your payment | Primerly',
    robots: { index: false },
};

export default function BillingCallbackPage() {
    return (
        <Suspense fallback={null}>
            <CallbackClient />
        </Suspense>
    );
}
