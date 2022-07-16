import React, { useEffect, useContext } from 'react';
import Styles from 'styles/Menu.css';
import TopBarResponse from './TopBarResponse';
import SelectMode from './SelectMode';
import { ConfigContext } from './Game';

export default function Menu({state, dispatch, findGames}) {

  const {mode, setMode, inputWidth} = useContext(ConfigContext);

  useEffect(() => {
    function randomUsername() {
      var S4 = function() {
         return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      return ('user' + S4()+S4());
    };
    const username = localStorage.getItem('username');
    if (username === null || username === '') {
      dispatch({type: 'UPDATE_USERNAME', username: randomUsername()});
    } else {
      dispatch({type: 'UPDATE_USERNAME', username: username});
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('username', state.username);
  }, [state.username]);

  function changeUsername(e) {
    if (e.target.value === '') {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: 'Username cannot be empty.'
        }
      });
    } else {
      dispatch({type: 'CLEAR_TOP_BAR_RESPONSE'});
    }
    dispatch({type: 'UPDATE_USERNAME', username: e.target.value});
  };

  return (
    <div className={Styles.mainContainer}>
      <TopBarResponse state={state} dispatch={dispatch} findGames={findGames} />
      <div className={Styles.version}>v1.1.1</div>
      <h1 className={Styles.heading}>Tic-Tac-Chat</h1>
      {!state.multiplayer &&
        <div className={Styles.subContainer}>
          <div className={Styles.usernameContainer}>
            <div className={Styles.atme}>@</div>
            <input
              className={Styles.username}
              style={{width: inputWidth}}
              onChange={changeUsername}
              value={state.username}
            />
          </div>
          <SelectMode mode={mode} setMode={setMode} />
        </div>
      }
    </div>
  );
};