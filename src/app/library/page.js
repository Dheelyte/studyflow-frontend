import { Suspense } from 'react';
import LibraryClient from './LibraryClient';
import SkeletonCard from '@/components/SkeletonCard';

export const metadata = {
  title: 'Library',
};

export default function LibraryPage() {
  return (
    <Suspense fallback={<div style={{ padding: '24px' }}><div style={{ display: 'flex', gap: '20px' }}><div style={{ minWidth: 0 }}><SkeletonCard /></div><div style={{ minWidth: 0 }}><SkeletonCard /></div></div></div>}>
      <LibraryClient />
    </Suspense>
  );
}
