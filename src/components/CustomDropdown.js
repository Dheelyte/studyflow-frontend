"use client";
import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomDropdown.module.css';
import { ChevronDown } from './Icons';

export default function CustomDropdown({ options, value, onChange, placeholder, className = '', ariaLabel }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`${styles.container} ${className}`} ref={containerRef}>
            <button
                type="button"
                aria-label={ariaLabel}
                aria-expanded={isOpen}
                className={`${styles.trigger} ${!selectedOption ? styles.placeholder : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <ChevronDown size={16} className={styles.icon} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
            </button>

            {isOpen && (
                <div className={styles.menu}>
                    {options.map((option) => (
                        <div 
                            key={option.value} 
                            className={`${styles.item} ${value === option.value ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            <span className={styles.itemLabel}>{option.label}</span>
                            {option.description && (
                                <span className={styles.itemDesc}>{option.description}</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
