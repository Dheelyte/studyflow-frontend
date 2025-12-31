import React from 'react';

const PostSkeleton = () => (
    <div style={{
        marginBottom:'16px', 
        padding:'24px', 
        border:'1px solid var(--border)', 
        borderRadius:'16px', 
        background:'var(--card)'
    }}>
        <div style={{display:'flex', gap:'12px', marginBottom:'16px'}}>
            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'var(--border)', animation:'pulseSkeleton 1.5s infinite'}}></div>
            <div style={{flex:1}}>
                 <div style={{width:'30%', height:'14px', background:'var(--border)', borderRadius:'4px', marginBottom:'6px', animation:'pulseSkeleton 1.5s infinite'}}></div>
                 <div style={{width:'20%', height:'12px', background:'var(--border)', borderRadius:'4px', animation:'pulseSkeleton 1.5s infinite'}}></div>
            </div>
        </div>
        <div style={{width:'100%', height:'16px', background:'var(--border)', borderRadius:'4px', marginBottom:'8px', animation:'pulseSkeleton 1.5s infinite'}}></div>
        <div style={{width:'80%', height:'16px', background:'var(--border)', borderRadius:'4px', animation:'pulseSkeleton 1.5s infinite'}}></div>
        <style jsx global>{`
            @keyframes pulseSkeleton {
                0% { opacity: 0.6; }
                50% { opacity: 0.3; }
                100% { opacity: 0.6; }
            }
        `}</style>
    </div>
);

export default PostSkeleton;
