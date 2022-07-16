import React from 'react';
import styles from '../styles/Board.css';

export default function Reset ({resetBoard}) {
  return (
    <div id='resetButton' className={styles.resetButton} onClick={resetBoard}>Restart Game</div>
  );
};