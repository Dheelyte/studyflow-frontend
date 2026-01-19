"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { curriculum } from '@/services/api';
import Card from '@/components/Card';
import SkeletonCard from '@/components/SkeletonCard';

export default function LibraryClient() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

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
            description: "Your personalized curriculum",
            progress: item.progress?.percentage || 0,
            completedModules: item.progress?.completed_modules || 0,
            totalModules: item.progress?.total_modules || 0,
            level: item.playlist?.level,
            color: colors[index % colors.length],
            link: `/playlist/${item.playlist?.id || 1}`
          }));
          setPlaylists(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [user]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Library</h1>
        <p className={styles.subtitle}>All your active courses and generated playlists.</p>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <>
            <div style={{ minWidth: 0 }}><SkeletonCard /></div>
            <div style={{ minWidth: 0 }}><SkeletonCard /></div>
            <div style={{ minWidth: 0 }}><SkeletonCard /></div>
            <div style={{ minWidth: 0 }}><SkeletonCard /></div>
            <div style={{ minWidth: 0 }}><SkeletonCard /></div>
            <div style={{ minWidth: 0 }}><SkeletonCard /></div>
          </>
        ) : playlists.length > 0 ? (
          playlists.map(playlist => (
            <Link key={playlist.id} href={playlist.link} style={{ display: 'block', textDecoration: 'none' }}>
              <Card
                title={playlist.title}
                description={playlist.description}
                color={playlist.color}
                progress={playlist.progress}
                completedModules={playlist.completedModules}
                totalModules={playlist.totalModules}
                level={playlist.level}
              />
            </Link>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--secondary)' }}>
            No playlists found. Start a new topic from the Dashboard!
          </div>
        )}
      </div>
    </div>
  );
}
