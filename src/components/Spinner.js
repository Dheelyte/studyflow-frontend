import React from 'react';
import styles from './Spinner.module.css';

export default function Spinner({ size = 24, style = {} }) {
  return (
    <div 
        className={styles.spinner} 
        style={{
            width: size, 
            height: size, 
            ...style
        }} 
    />
  );
}
