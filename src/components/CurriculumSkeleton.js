import React from 'react';

const CurriculumSkeleton = () => (
    <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', width: '100%', maxWidth: '600px'}}>
             <div style={{width: '120px', height: '120px', borderRadius: '24px', background: 'var(--border)', margin: '0 auto 32px auto', animation: 'pulseSkeleton 1.5s infinite'}}></div>
             <div style={{width: '60%', height: '40px', background: 'var(--border)', borderRadius: '8px', margin: '0 auto 16px auto', animation: 'pulseSkeleton 1.5s infinite'}}></div>
             <div style={{width: '80%', height: '20px', background: 'var(--border)', borderRadius: '8px', margin: '0 auto', animation: 'pulseSkeleton 1.5s infinite'}}></div>
             <div style={{marginTop: '40px', width: '100px', height: '16px', background: 'var(--border)', borderRadius: '4px', margin: '40px auto 0 auto', animation: 'pulseSkeleton 1.5s infinite'}}></div>
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

export default CurriculumSkeleton;
