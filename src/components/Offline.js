import React, { useEffect } from 'react';
import Menu from './Menu';
import Board from './Board';
import Reset from './Reset';
import MoveList from './MoveList';
import styles from 'styles/offline.css';

export default function Offline ({ state, dispatch, resetBoard, history, jumpToSquares }) {

  useEffect(() => {
    resetBoard();
  }, [])

  return (
    <div className={styles.mainContainer}>
      <div className={styles.menuContainer}>
        <Menu state={state} dispatch={dispatch}/>
      </div>
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <Board state={state} dispatch={dispatch} />
          <div className={styles.buttons}>
            <Reset resetBoard={resetBoard} />
            <MoveList history={history} jumpToSquares={jumpToSquares} />
          </div>
        </div>
      </div>
    </div>
  );
};