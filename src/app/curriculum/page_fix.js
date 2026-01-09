            <div className={styles.controls}>
                <button className={styles.playButton} onClick={handlePlay} disabled={isCreating}>
                    <PlayIcon size={24} fill="white" />
                    {isCreating ? "Creating Playlist..." : (isStarted ? "Continue Learning" : "Start Learning")}
                </button>

                <button className={styles.iconButton} title="Share Playlist">
                    <ShareIcon />
                </button>
            </div>
