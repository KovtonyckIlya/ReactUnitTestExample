import React, { useState } from 'react';
import Styles from 'styles/SearchGames.css';

export default function Chat({filterGames, setTyping, setValue, setFocused}) {

  const [timeOut, storeTimeOut] = useState(null);

  function handleKeyDown() {
    setTyping(true);
  };

  function handleChange(e) {
    clearTimeout(timeOut);
    const value = e.target.value;
    setValue(value);
    if (value === '') return;
    const timeout = setTimeout(() => {
      filterGames(value);
      setTyping(false);
    }, 350);
    storeTimeOut(timeout);
  };

  function onFocus() {
    setFocused(true);
  };

  function onBlur() {
    setFocused(false);
  };

  return (
    <div className={Styles.inputContainer}>
      <input
        placeholder={'Search game id or room name.'}
        className={Styles.input}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};