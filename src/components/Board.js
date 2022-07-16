import React,{ useEffect, useState }from 'react';
import Square from './Square';
import styles from 'styles/Board.css';
import calculateWinner from '../helpers/calculateWinner';
import chunkArray from '../helpers/chunkArray';

function isPlayerNext(state) {
  const {isXNext,allPlayers} = state;
  const nextMove = (isXNext ? 'X' : 'O');
  console.log(allPlayers)
  const nextPlayer = allPlayers
    .filter(user => user.move === nextMove)
    .reduce((acc, current) => ({...acc, ...current}), {});

  return nextPlayer;
};

function gameStatus(state) {
  let {squares, isXNext, allPlayers, multiplayer, gameFull} = state;
  let winner = calculateWinner(squares);
  let nextMove = (isXNext ? 'X' : 'O');
  let status;
  let gameOver;

  if (winner) {
    if (multiplayer) {
      const playerThatWon = allPlayers
        .filter(user => user.move === winner)
        .reduce((acc, current) => ({...acc, ...current}), {});

      status = playerThatWon.username + ' is the winner!';
    } else {
      status = 'Winner: ' + winner;
    };
    gameOver = true;
  } else if (!winner && squares.every(item => item !== null)) {
    status = 'Game was a tie';
    gameOver = true;
  } else if (multiplayer && !gameFull) {
    status = 'Waiting for second player to join.'
  } else if (multiplayer && gameFull) {
    const nextPlayer = isPlayerNext(state);
    status = 'Next player: ' + nextPlayer.username;
  } else {
    status = 'Next player: ' + nextMove;
  };
  return {
    status,
    gameOver
  };
};

function Board({state, dispatch, sendMessage}) {
  const { squares, gameFull, multiplayer, clientID } = state;
  const status = gameStatus(state);
  const [timeOut, storeTimeOut] = useState(null);
  const [notYourTurn, setNotYourTurn] = useState(false);
  const chunkedArray = chunkArray(squares, 3);

  useEffect(() => {
    if (status.gameOver === true) {
      dispatch({type: 'GAME_OVER'})
    };
  }, [status.gameOver])

  useEffect(() => {
    if (notYourTurn !== false) {
      clearTimeout(timeOut)
      const timeout = setTimeout(() => {
        setNotYourTurn(false)
      }, 1000)
      storeTimeOut(timeout)
    }
    return () => {
      clearTimeout(timeOut)
    }
  }, [notYourTurn])

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    };
    if (multiplayer) {
      if (!gameFull) {
        return;
      }
      const nextPlayer = isPlayerNext(state);
      if (clientID !== nextPlayer.clientID) {
        setNotYourTurn(true);
        return;
      }
      const msg = {
        type: "updateSquares",
        index: i,
        gameId: state.gameId
      };
      sendMessage(msg);
    } else {
      dispatch({type: 'SELECT_SQUARE', index: i});
    };
  };

  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
      />
    );
  };

  return (
    <div className={styles.boardContainer}>
      <div id='status' className={styles.status}>{notYourTurn ? "It's not your turn." : status.status}</div>
      {chunkedArray.map((array, i) => {
        return (
          <div key={i} className={styles.boardRow}>
            {array.map((_, index) => {
              const chunkIndex = i > 0 ? ((i * 3) + index) : index;
              return renderSquare(chunkIndex);
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;