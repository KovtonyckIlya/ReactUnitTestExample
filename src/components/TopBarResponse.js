import React, { useContext } from 'react';
import { ConfigContext } from './Game';
import Styles from 'styles/TopBarResponse.css';

export default function TopBarResponse({state, dispatch, findGames}) {
  
  const { isMobile, mode } = useContext(ConfigContext);
  const { topBarResponse } = state;
  let component;

  function clearTopBarResponse() {
    dispatch({ type: 'CLEAR_TOP_BAR_RESPONSE' });
    //Removes params so if you refresh it wont try to join game again.
    window.history.pushState(null, null, window.location.pathname);
  };

  switch(topBarResponse.type) {
    case "ERROR" : {
      component = (
        <div className={Styles.errorContainer}>
          <div className={Styles.message}>{topBarResponse.message}</div>
          <div className={Styles.dismiss} onClick={clearTopBarResponse}>dismiss</div>
        </div>
      );
      break;
    }
    case "MESSAGE" : {
      component = (
        <div className={Styles.successContainer}>
          <div className={Styles.message}>{topBarResponse.message}</div>
          <div className={Styles.dismiss} onClick={clearTopBarResponse}>dismiss</div>
        </div>
      );
      break;
    }
    case "gamesUpdated" : {
      !state.multiplayer && mode === 'join' ? component = (
        <div className={Styles.successContainer}>
          {isMobile ?
            <div>
              <div className={Styles.message}>Games updated, pull to refresh.</div>
              <div className={Styles.dismiss} onClick={clearTopBarResponse}>dismiss</div>
            </div>
            :
            <div>
              <div className={Styles.message}>Games updated.</div>
              <div className={Styles.dismiss} onClick={findGames}>click to refresh.</div>
            </div>
          }
        </div>
      )
      :
      component = null;
      break;
    }
    default : {
      component = null;
    };
  };
  return component;
};