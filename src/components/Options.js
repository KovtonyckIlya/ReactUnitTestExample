import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './Game';
import Loader from './Loader';
import Styles from 'styles/Options.css';

export default function Options({state, openGame, sendMessage}) {

  const [recipient, setRecipient] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [privateGameError, setPrivateGameError] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(false);
  const { url } = useContext(ConfigContext);

  useEffect(() => {
    fetch(url + '/checkPrivacy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId: state.gameId
      })
    }).then(response => response.json()).then(response => {
      if (response.checkBoxValue) {
        setCheckboxValue(response.checkBoxValue);
      };
      if (response.redirect) {
        window.location.replace(response.url);
      };
    }).catch(err => {
      console.log(err)
    })
  }, []);

  function kickPlayer(ID) {
    const msg = {
      type: "kickPlayer",
      gameId: state.gameId,
      clientID: ID
    };
    sendMessage(msg);
  };

  function updateRecipient(e) {
    if (response) {
      setResponse('');
    };
    setRecipient(e.target.value);
  };

  function sendInvite() {
    if (state.gameFull || loading) return;
    setError('');
    const isnum = /^\d{10}$/.test(recipient);
    const isemail = /\S+@\S+\.\S+/.test(recipient);
    if (!isnum && !isemail) {
      setError('Please enter a valid 10 digit number (no parentheses or dashes) or email.');
      return;
    };
    setLoading(true);
    fetch(url + '/sendInvite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient,
        name: state.username,
        gameId: state.gameId,
        url: url
      })
    }).then(response => {
      return response.json();
    }).then(response => {
      setLoading(false);
      if (response.message === 'ok') {
        setRecipient('');
        setResponse('Invite sent!');
      } else if (response.error) {
        setResponse(response.message);
      } else if (response.redirect) {
        window.location.replace(response.url);
      };
    }).catch(err => {
      setResponse(err.message);
      setLoading(false);
    });
  };

  function checkBoxChanged(e) {
    setPrivateGameError('');
    setCheckboxValue(e.target.checked);
    fetch(url + '/toggleGamePrivate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checked: e.target.checked,
        gameId: state.gameId
      })
    }).then(response => {
      return response.json();
    }).then(response => {
      if (response.error) {
        setPrivateGameError(response.message);
      } else if (response.redirect) {
        window.location.replace(response.url);
      };
    });
  };

  return (
    <div className={Styles.mainContainer}>
      <div className={Styles.header}>
        <div className={Styles.closeButton} onClick={openGame}>Close</div>
        <div className={Styles.options}>Options</div>
      </div>
      {state.allPlayers.length > 0 ?
        <div className={Styles.container}>
          <div className={Styles.listHeading}>Players</div>
          {state.allPlayers.map(player => {
            return (
              <div className={Styles.playerContainer}>
                <div className={Styles.li}>Name: {player.username}</div>
                <div className={Styles.li}>Move: {player.move}</div>
                <div className={Styles.li}>ClientID: {player.clientID}</div>
                {!player.host && state.host && <div onClick={() => kickPlayer(player.clientID)} className={Styles.kickPlayer}>Kick Player</div>}
                <div className={Styles.line}></div>
              </div>
            );
          })}
        </div>
        :
        <div className={Styles.container}>
          <div className={Styles.listHeading}>Players</div>
          <div className={Styles.playerContainer}>
            <div className={Styles.li}>Name: {state.username}</div>
            <div className={Styles.li}>Move: {state.move}</div>
            <div className={Styles.li}>ClientID: {state.clientID}</div>
            <div className={Styles.line}></div>
          </div>
        </div>
      }
      {state.host ?
        <div>
          <div className={[Styles.container, Styles.marginTop].join(' ')}>
            <div className={Styles.listHeading}>Invite Players</div>
            <div className={Styles.inputLabel}>Enter player email or phone number.</div>
            <div className={Styles.error}>{error}</div>
            <div className={Styles.response}>{!error && response}</div>
            {loading && <Loader color={'#03a9f4'} />}
            <input value={recipient} onChange={updateRecipient} className={Styles.input} disabled={state.gameFull ? true : false}/>
            <div 
              onClick={sendInvite}
              className={Styles.gameButton}
              style={state.gameFull ? {background: '#ccc', cursor: 'default'} : {background: '#03a9f4', cursor: 'pointer'}}
            >
              {state.gameFull ? 'Game is full' : 'Send Invite'}
            </div>
          </div>
            <div className={[Styles.container, Styles.marginTop].join(' ')}>
              <div className={Styles.listHeading}>More Settings</div>
              <div className={Styles.error}>{privateGameError}</div>
              <div className={Styles.inlineBox}>
                <div className={Styles.privateGame}>Private Game</div>
                <input
                  type="checkbox"
                  className={Styles.checkBox}
                  checked={checkboxValue}
                  onChange={checkBoxChanged}
                />
              </div>
              <div className={Styles.line}></div>
          </div>
        </div>
        :
        <div className={Styles.moreOptions}>More options available when you are the host.</div>
      }
    </div>
  );
};