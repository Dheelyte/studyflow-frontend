"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, ZapIcon } from "@/components/Icons";
import CustomDropdown from "@/components/CustomDropdown";
import styles from './IntegratedSearchBar.module.css';

export default function IntegratedSearchBar({ redirect = false, onSearch }) {
    const router = useRouter();
    const [themeQuery, setQuery] = useState('');
    const [experience, setExperience] = useState('');
    const [duration, setDuration] = useState('');
    
    const experienceOptions = [
      { value: 'Beginner', label: 'Beginner', description: 'Start from scratch. No prior knowledge.' },
      { value: 'Intermediate', label: 'Intermediate', description: 'Deepen understanding and best practices.' },
      { value: 'Advanced', label: 'Advanced', description: 'Expert topics and complex systems.' }
    ];

    const durationOptions = [
      { value: '1 Day', label: '1 Day', description: 'Intensive crash course.' },
      { value: '7 Days', label: '7 Days', description: 'Standard weekly sprint.' },
      { value: '1 Month', label: '1 Month', description: 'In-depth mastery path.' },
      { value: '3 Months', label: '3 Months', description: 'Complete zero-to-hero journey.' }
    ];

    const handleStart = () => {
        if (!themeQuery.trim()) return;

        const finalExperience = experience || 'Beginner';
        const finalDuration = duration || '7 Days';

        if (redirect) {
            const query = {
                topic: themeQuery,
                experience: finalExperience,
                duration: finalDuration
            };
            const queryString = new URLSearchParams(query).toString();
            // In a real app we might pass this to dashboard to auto-start, 
            // but for now let's just go to dashboard and prepopulate if we were clever,
            // or directly to playlist generation if that was the flow.
            // Let's redirect to dashboard with search params so dashboard can pick it up if we wanted.
            // For MVP simplicity, let's redirect to playlist generation directly!
             router.push(`/playlist/1?${queryString}`);
        } else if (onSearch) {
            onSearch({ topic: themeQuery, experience: finalExperience, duration: finalDuration });
        }
    };

    return (
        <div className={styles.integratedSearchBar}>
            {/* Group Input and Icon together for mobile alignment */}
            <div className={styles.inputGroup}>
                <div className={styles.searchIconWrapper}>
                    <SearchIcon size={24} />
                </div>
                
                <input 
                    type="text" 
                    className={styles.searchInput} 
                    placeholder="What do you want to learn today?" 
                    value={themeQuery}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
            </div>

            <div className={styles.divider}></div>

            <CustomDropdown 
                options={experienceOptions}
                value={experience}
                onChange={setExperience}
                placeholder="Experience Level"
            />

            <div className={styles.divider}></div>

            <CustomDropdown 
                options={durationOptions}
                value={duration}
                onChange={setDuration}
                placeholder="Duration"
            />

            <button className={styles.searchButton} onClick={handleStart}>
                <span>Start</span>
                <ZapIcon size={20} fill="white" />
            </button>
        </div>
    );
}
