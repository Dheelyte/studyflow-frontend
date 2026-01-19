import { Suspense } from 'react';
import ForgotPasswordClient from './ForgotPasswordClient';
import Spinner from '@/components/Spinner';

export const metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}><Spinner /></div>}>
      <ForgotPasswordClient />
    </Suspense>
  );
}
