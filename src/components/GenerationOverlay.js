"use client";
import { useState, useEffect, useRef } from 'react';
import styles from './GenerationOverlay.module.css';

const FACTS = [
    "Did you know? Spaced repetition can improve retention by up to 200%.",
    "Active recall is more effective than re-reading notes.",
    "The Feynman Technique: Teach a concept to understand it better.",
    "Sleep is crucial for memory consolidation after learning.",
    "Pomodoro technique helps maintain focus for longer periods.",
    "Interleaved practice boosts problem-solving skills.",
    "Dual coding (images + text) enhances learning.",
    "Teaching others is the highest form of mastery."
];

const RELATED_TERMS = [
    "Concepts", "History", "Syntax", "Patterns", "Tools", 
    "Best Practices", "Case Studies", "Frameworks", "Security",
    "Optimization", "Architecture", "Debugging", "Community",
    "Resources", "Algorithms", "Data Structures"
];

// Reduced logs to ensure they have enough time to finish typing
const LOG_MESSAGES = [
    "Initializing knowledge engine...",
    "Connecting to global learning graph...",
    "Parsing educational documentation...",
    "Optimizing for experience level...",
    "Generating localized examples...",
    "Finalizing curriculum path..."
];

export default function GenerationOverlay({ topic, experience, onComplete, isFinished = false }) {
    const [nodes, setNodes] = useState([]);
    const [lines, setLines] = useState([]);
    const [factIndex, setFactIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const [typedText, setTypedText] = useState('');
    
    const containerRef = useRef(null);
    const boxRef = useRef(null); 

    // Initial fact rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setFactIndex(prev => (prev + 1) % FACTS.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // Progress and Logs timer with stall logic
    useEffect(() => {
        // Base duration to reach 99% (40 seconds)
        const simulatedDuration = 40000; 
        const startTime = Date.now();
        
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            
            // If finished, we want to complete quickly
            if (isFinished) {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    // Jump to 100% faster if finished
                    return Math.min(prev + 5, 100);
                });
            } else {
                // Not finished yet: calculate steady progress
                // Linear interpolation from 0 to 99 over 40000ms
                let p = (elapsed / simulatedDuration) * 99;
                
                // Cap at 99% if not finished
                if (p > 99) p = 99;
                
                setProgress(p);
            }

            // Logic to drive logs based on progress
            // Map 0-99% to the available log messages
            const currentP = isFinished ? 100 : (Math.min((elapsed / simulatedDuration) * 99, 99));
            const logIndex = Math.floor((currentP / 100) * LOG_MESSAGES.length);
            
            if (logIndex < LOG_MESSAGES.length && LOG_MESSAGES[logIndex]) {
                 setLogs(prev => {
                     const msg = LOG_MESSAGES[logIndex];
                     if (prev[0] !== msg) {
                         return [msg];
                     }
                     return prev;
                 });
            }

        }, 100);

        return () => clearInterval(interval);
    }, [isFinished]);

    // Completion Effect
    useEffect(() => {
        if (progress >= 100 && onComplete) {
            const timer = setTimeout(() => {
                 onComplete();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete]);

    // Robust Typing Effect using Date.now()
    useEffect(() => {
        if (logs.length === 0) return;
        const targetText = logs[0];
        setTypedText('');
        
        const startTime = Date.now();
        const charDuration = 25; // ms per char

        const interval = setInterval(() => {
            const now = Date.now();
            const elapsed = now - startTime;
            const charCount = Math.floor(elapsed / charDuration);
            
            if (charCount >= targetText.length) {
                setTypedText(targetText);
                clearInterval(interval);
            } else {
                setTypedText(targetText.substring(0, charCount));
            }
        }, 16); // Check every frame (~60fps)

        return () => clearInterval(interval);
    }, [logs]);

    // Spawn nodes logic
    useEffect(() => {
        let count = 0;
        const maxNodes = 8;
        
        const spawnInterval = setInterval(() => {
            if (count >= maxNodes) {
                clearInterval(spawnInterval);
                return;
            }

            const angle = Math.random() * Math.PI * 2;
            const distance = 160 + Math.random() * 100; 
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const newNode = {
                id: count,
                x,
                y,
                label: RELATED_TERMS[Math.floor(Math.random() * RELATED_TERMS.length)]
            };

            setNodes(prev => [...prev, newNode]);
            setLines(prev => [...prev, { id: count, x2: x, y2: y }]);
            count++;
        }, 1200);

        return () => clearInterval(spawnInterval);
    }, []);

    // SVG Progress Calculation
    const radius = 90; // Inside 200px box (200/2 - stroke)
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={styles.overlay}>
             <div className={styles.graphContainer} ref={containerRef}>
                {/* Lines Layer */}
                <svg className={styles.connections}>
                    <g transform="translate(50%, 50%)" style={{ overflow: 'visible' }}>
                        {lines.map(line => (
                            <line 
                                key={line.id}
                                x1={0} y1={0}
                                x2={line.x2} y2={line.y2}
                                className={styles.line}
                            />
                        ))}
                    </g>
                </svg>

                {/* Center Node + Progress Ring */}
                <div className={styles.centerWrapper}>
                    <svg className={styles.progressSvg}>
                         {/* Background Circle */}
                        <circle 
                            cx="100" cy="100" r={radius} 
                            className={styles.progressBg}
                        />
                        {/* Progress Circle */}
                        <circle 
                            cx="100" cy="100" r={radius} 
                            className={styles.progressCircle}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>

                    <div className={styles.centerNode} ref={boxRef}>
                        <div>{topic}</div>
                        <div className={styles.percentage}>{Math.round(progress)}%</div>
                    </div>
                </div>

                {/* Floating Nodes */}
                {nodes.map(node => (
                    <div 
                        key={node.id} 
                        className={styles.node}
                        style={{
                            transform: `translate(${node.x}px, ${node.y}px)`   
                        }}
                    >
                        {node.label}
                    </div>
                ))}
             </div>

             <div className={styles.statusBar}>
                <div className={styles.logContainer}>
                    {/* Render only the typed text */}
                    {logs.length > 0 && (
                        <div className={styles.logItem}>
                           &gt;_ {typedText}<span className={styles.cursor}>|</span>
                        </div>
                    )}
                </div>

                <div className={styles.factBox}>
                    <div className={styles.factLabel}>Did You Know?</div>
                    <div className={styles.factText} key={factIndex} style={{animation: 'fadeIn 0.5s'}}>
                        {FACTS[factIndex]}
                    </div>
                </div>
             </div>
        </div>
    );
}
