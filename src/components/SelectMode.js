import React from 'react';
import styles from 'styles/selectMode.css';

export default function SelectMode ({mode, setMode}) {

  function changeMode(mode) {
    setMode(mode);
  };

  return (
    <div className={styles.container}>
      <div 
        className={mode === 'offline' ? [styles.active, styles.link].join(' ') : styles.link}
        onClick={() => changeMode('offline')}
        >
        Play offline
      </div>
      <div
        className={mode === 'create' ? [styles.active, styles.link].join(' ') : styles.link} 
        onClick={() => changeMode('create')}
        >
        Create game
      </div>
      <div
        className={mode === 'join' ? [styles.active, styles.link].join(' ') : styles.link} 
        onClick={() => changeMode('join')}
        >
        Join game
      </div>
    </div>
  );
};  