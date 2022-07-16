import React, { useState, useEffect, useContext } from 'react';
import Menu from './Menu';
import OnlineBoard from './OnlineBoard';
import styles from 'styles/Create.css';

export default function Create ({state, dispatch, sendMessage}) {

  const [name, setName] = useState('');
  const [move, setMove] = useState('');
  const [error, setError] = useState(null);
  const [moveError, setMoveError] = useState(null);

  useEffect(() => {
    setName('');
    setMove('');
  }, [state.multiplayer])

  function createGame() {
    if (state.username === '') {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: 'Username cannot be empty.'
        }
      });
      return;
    } else {
      dispatch({type: 'CLEAR_TOP_BAR_RESPONSE'});
    };
    if (name === '') {
      setError('Please enter a room name.');
      return;
    } else if (move === '') {
      setMoveError('Please select a move.');
      return;
    };
    const msg = {
      type: "createGame",
      roomName: name,
      username: state.username,
      move: move
    };
    sendMessage(msg);
  };  

  function changeName(e) {
    setError('');
    setName(e.target.value);
  };

  function changeMove(e) {
    setMoveError('');
    setMove(e.target.value);
  };

  return (
    <div>
      {state.multiplayer ? 
        <OnlineBoard state={state} dispatch={dispatch} sendMessage={sendMessage}/>
        :
        <div className={styles.mainContainer}>
          <div className={styles.menuContainer}>
            <Menu state={state} dispatch={dispatch}/>
          </div>
          <div className={styles.container}>
            <div className={styles.optionsContainer}>
              <label className={styles.label}>Create a room name: </label>
              <div className={styles.error}>{error}</div>
              <input value={name} onChange={changeName} className={styles.input} />
              <label className={styles.label}>Select your move:</label>
              <div className={styles.error}>{moveError}</div>
              <div className={styles.marginTop}>
                <input name={'move'} value={'X'} onChange={changeMove} type={'radio'}/>
                <label className={styles.moveLabel}>X</label>
              </div>
              <div>
                <input name={'move'} value={'O'} onChange={changeMove} type={'radio'}/>
                <label className={styles.moveLabel}>O</label>
              </div>
              <button onClick={createGame} className={styles.button}>
                Create Game
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}