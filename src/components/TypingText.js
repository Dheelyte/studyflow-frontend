"use client";
import { useState, useEffect } from 'react';

export default function TypingText({ words = [], speed = 120, deleteSpeed = 80, pauseStr = 2000 }) {
    const [index, setIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    useEffect(() => {
        const currentWord = words[index % words.length];
        
        let timer;
        
        const typeChar = () => {
            setDisplayedText(prev => currentWord.substring(0, prev.length + 1));
        };
        
        const deleteChar = () => {
            setDisplayedText(prev => currentWord.substring(0, prev.length - 1));
        };

        if (!isDeleting && displayedText === currentWord) {
             // Finished typing, pause then switch to deleting
             timer = setTimeout(() => setIsDeleting(true), pauseStr);
        } else if (isDeleting && displayedText === '') {
             // Finished deleting, move to next word
             setIsDeleting(false);
             setIndex(prev => (prev + 1) % words.length);
             // Optional small pause before starting next word
             timer = setTimeout(() => {}, 200); 
        } else if (isDeleting) {
             // Deleting
             timer = setTimeout(deleteChar, deleteSpeed);
        } else {
             // Typing
             timer = setTimeout(typeChar, speed);
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, index, words, speed, deleteSpeed, pauseStr]);

    return (
        <span style={{ display: 'inline-block', minWidth: '10px' }}>
            {displayedText}
            <span className="blinking-cursor">|</span>
            <style jsx>{`
                .blinking-cursor {
                    animation: blink 1s step-end infinite;
                    color: var(--primary);
                    margin-left: 2px;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </span>
    );
}
