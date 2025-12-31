import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius, style, className }) => {
    return (
        <div 
            className={`${styles.skeleton} ${className || ''}`} 
            style={{ 
                width: width || '100%', 
                height: height || '1em', 
                borderRadius: borderRadius,
                ...style 
            }}
        ></div>
    );
};

export default Skeleton;
