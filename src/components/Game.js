import React, { useState, useEffect } from 'react'
import Offline from './Offline';
import Create from './Create';
import Join from './Join';
import getConfig from '../helpers/getConfig';
import useWebSocket from '../hooks/webSocket';
import useGameReducer from '../hooks/gameReducer';
import useTimeMachine from '../hooks/timeMachine';
import useLocalStorage from '../hooks/localStorage';
import Styles from '../styles/Game.css';

export const ConfigContext = React.createContext();

export default function Game (config) {
  const {url, socketUrl, isMobile} = getConfig(config);
  const [state, dispatch] = useGameReducer();
  const { history, jumpToSquares, resetHistory } = useTimeMachine(state.squares, dispatch);
  const { sendMessage } = useWebSocket(state, dispatch, socketUrl);
  const [mode, setMode] = useLocalStorage('mode','create');
  const [inputWidth, setWidth] = useState(state.username.length + 'ch');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error) {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: error
        }
      });
    };
  }, []);
  
  useEffect(() => { 
    setWidth(state.username.length + 1 + 'ch');
  }, [state.username]);

  function resetBoard () {
    dispatch({type: 'RESET_SQUARE'});
    resetHistory();
  };

  let component;

  switch(mode) {
    case "offline":
      component = <Offline
                    resetBoard={resetBoard} 
                    history={history}
                    jumpToSquares={jumpToSquares}
                    state={state} 
                    dispatch={dispatch}
                  />  
      break;
    case "create": 
      component = <Create 
                    state={state}
                    dispatch={dispatch}
                    sendMessage={sendMessage}
                  />
      break;
    case "join":
      component = <Join
                    state={state}
                    dispatch={dispatch}
                    sendMessage={sendMessage}
                  />
  }

  return (
    <ConfigContext.Provider value={{
      url: url, 
      isMobile: isMobile,
      setMode: setMode,
      mode: mode,
      inputWidth: inputWidth
      }}
      >
        <div className={Styles.mainContainer}>
          {component}
        </div>
    </ConfigContext.Provider>
  );
};