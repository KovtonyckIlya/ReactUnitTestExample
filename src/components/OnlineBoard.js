import React, { useState, useEffect } from 'react';
import OnlineGame from './OnlineGame';
import Options from './Options';
import Chat from './Chat';

export default function OnlineBoard({state, dispatch, sendMessage}) {
  
  const [component, setComponent] = useState('GAME');
  const [timeOut, storeTimeOut] = useState(null);

  useEffect(() => {
    if (state.gameFull === false && component === 'CHAT') {
      setComponent('GAME');
    }
  }, [state.gameFull]);

  useEffect(() => {
    if (state.response.type !== undefined) {
      clearTimeout(timeOut)
      const timeout = setTimeout(() => {
        dispatch({type: "CLEAR_RESPONSE"})
      }, 5000)
      storeTimeOut(timeout)
    }
    return () => {
      clearTimeout(timeOut)
    }
  }, [state.response]);

  function startChatMode() {
    if (!state.gameFull) return;
    setComponent('CHAT');
  };

  function openOptions() {
    setComponent('OPTIONS');
  };

  function openGame() {
    setComponent('GAME');
  };

  let renderedComponent;

  switch(component) {
    case 'CHAT':
      renderedComponent = <Chat 
                            state={state}
                            setComponent={setComponent}
                            sendMessage={sendMessage}
                          />
      break;
    case 'GAME':
      renderedComponent = <OnlineGame 
                            state={state} 
                            dispatch={dispatch} 
                            sendMessage={sendMessage} 
                            startChatMode={startChatMode} 
                            openOptions={openOptions}
                          />
      break;
    case 'OPTIONS':
      renderedComponent = <Options
                            state={state}
                            sendMessage={sendMessage}
                            openGame={openGame}
                          />
      break;
  };

  return renderedComponent;
};