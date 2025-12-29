"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { curriculum } from '@/services/api';

export default function LibraryPage() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
        try {
            const response = await curriculum.getMyPlaylists();
            if (Array.isArray(response)) {
                
                const colors = [
                    'linear-gradient(135deg, #6366f1, #a855f7)', 
                    'linear-gradient(135deg, #3b82f6, #06b6d4)', 
                    'linear-gradient(135deg, #10b981, #34d399)', 
                    'linear-gradient(135deg, #f59e0b, #fbbf24)', 
                    'linear-gradient(135deg, #ec4899, #f472b6)' 
                ];

                const mapped = response.map((item, index) => ({
                    id: item.id,
                    title: item.playlist?.title || "Untitled Playlist",
                    progress: 0, // Mock
                    color: colors[index % colors.length],
                    modules: 'Modules: TBD', // Mock
                    link: `/playlist/${item.playlist?.id || 1}`
                }));
                // Mock data if empty for visual confirmation
                if (mapped.length === 0) {
                     // Keep empty
                }
                setPlaylists(mapped);
            }
        } catch (error) {
             console.error("Failed to fetch playlists:", error);
        }
    };

    if (user) {
        fetchPlaylists();
    }
  }, [user?.id]); // FIX: Depends on ID, not object ref

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Library</h1>
        <p className={styles.subtitle}>All your active courses and generated playlists.</p>
      </div>

      <div className={styles.grid}>
         {playlists.length > 0 ? (
            playlists.map(playlist => (
                 <Link key={playlist.id} href={playlist.link} style={{display: 'contents'}}>
                     <div className={styles.libraryCard}>
                         {/* Square Image Placeholder with Gradient */}
                         <div className={styles.imagePlaceholder} style={{background: playlist.color}}></div>
                         
                         <div className={styles.cardBody}>
                             <div>
                                 <div className={styles.cardTitle}>{playlist.title}</div>
                                 <div className={styles.cardMeta}>
                                     <span>{playlist.modules}</span>
                                     <span>{playlist.progress}%</span>
                                 </div>
                             </div>
                             <div className={styles.progressBar}>
                                 <div className={styles.progress} style={{width: `${playlist.progress}%`}}></div>
                             </div>
                         </div>
                     </div>
                 </Link>
            ))
         ) : (
            <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--secondary)'}}>
                No playlists found. Start a new topic from the Dashboard!
            </div>
         )}
      </div>
    </div>
  );
}
