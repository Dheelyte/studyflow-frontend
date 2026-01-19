"use client";
import React from 'react';

const PlaylistSkeleton = () => (
    <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
        {/* Header Skeleton */}
        <div style={{ position: 'relative', width: '100%', height: '400px', background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 70%)' }}></div>

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', padding: '60px 32px 40px 32px', marginTop: '-350px' }}>
            <div style={{ width: '160px', height: '160px', borderRadius: '24px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
                <div style={{ width: '100px', height: '24px', borderRadius: '20px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                <div style={{ width: '60%', height: '60px', borderRadius: '12px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                <div style={{ width: '40%', height: '24px', borderRadius: '8px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
            </div>
        </div>

        {/* Controls Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
            <div style={{ width: '180px', height: '56px', borderRadius: '32px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
        </div>

        {/* Content Skeleton */}
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ marginBottom: '48px', padding: '32px', border: '1px solid var(--border)', borderRadius: '16px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: '200px', height: '24px', borderRadius: '6px', background: 'var(--border)', marginBottom: '24px', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ width: '100%', height: '16px', borderRadius: '4px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                    <div style={{ width: '90%', height: '16px', borderRadius: '4px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                    <div style={{ width: '80%', height: '16px', borderRadius: '4px', background: 'var(--border)', animation: 'pulseSkeleton 1.5s infinite' }}></div>
                </div>
            </div>

            {/* Modules Skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', marginBottom: '24px', height: '80px', animation: 'pulseSkeleton 1.5s infinite' }}></div>
            ))}
        </div>

        <style jsx global>{`
            @keyframes pulseSkeleton {
                0% { opacity: 0.6; }
                50% { opacity: 0.3; }
                100% { opacity: 0.6; }
            }
        `}</style>
    </div>
);

export default PlaylistSkeleton;
