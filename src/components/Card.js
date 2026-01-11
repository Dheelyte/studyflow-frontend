import styles from './Card.module.css';

const PlayIcon = () => (
    <svg role="img" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
    </svg>
)

export default function Card({ title, description, color, progress, completedModules, totalModules, level, icon: Icon }) {
  const hasModuleInfo = typeof completedModules === 'number' && typeof totalModules === 'number';

  return (
    <div className={styles.card}>
      <div className={styles.image} style={{ background: color || 'linear-gradient(45deg, #333, #555)' }}>
        {level && <div className={styles.levelBadge}>{level}</div>}
        <div className={styles.playButton}>
            {Icon ? <Icon size={24} fill="currentColor" /> : <PlayIcon />}
        </div>
        <div className={styles.titleOverlay}>
            <div className={styles.title}>{title}</div>
            <div className={styles.description}>{description}</div>
            
        </div>
        {typeof progress === 'number' && (
            <>
                <div className={styles.percentage}>

                    <span>{Math.min(100, Math.max(0, Math.round(progress)))}%</span>
                    {hasModuleInfo && (
                        <>
                            <span className={styles.statsSeparator}>•</span>
                            <span className={styles.statsModules}>{completedModules}/{totalModules} Modules</span>
                        </>
                    )}
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}></div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}
