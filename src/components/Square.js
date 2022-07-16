import React from 'react';
import styles from 'styles/Square.css';

function Square({ value, onClick }) {
  return (
    <button
      className={styles.square}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;