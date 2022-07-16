import React, { useState, useEffect, useContext } from 'react';
import { ConfigContext } from './Game';
import Styles from 'styles/Chat.css';

export default function Chat({state, setComponent, sendMessage}) {

  const [message, setMessage] = useState('');
  const [paddingBottom, setPaddingBottom] = useState('10px');
  const {isMobile} = useContext(ConfigContext);
  const messageContainerRef = React.createRef();
  const inputRef = React.createRef();

  useEffect(() => {
    if (!isMobile) {
      scrollToBottomOfChatDesktop();
    };
  }, [messageContainerRef]);

  useEffect(() => {
    scrollToBottomOfChat()
  }, [state.chat]);

  function stopChatMode() {
    setComponent('GAME');
  };

  function closeKeyboard() {
    inputRef.current.blur();
  };

  function setInput(e) {
    setMessage(e.target.value);
  };

  function sendMessageMethod() {
    const msg = {
      type: "sendMessage",
      clientID: state.clientID,
      username: state.username,
      gameId: state.gameId,
      message: message
    };
    sendMessage(msg);
    setMessage('');
  };

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      sendMessageMethod();
    };
    if (e.key === 'Escape') {
      setComponent('GAME');
    };
  };

  function scrollToBottomOfChat() {
    window.scrollTo(0,document.body.scrollHeight);
  };

  function scrollToBottomOfChatDesktop() {
    if (messageContainerRef.current !== null) {
      if (messageContainerRef.current.lastChild !== null) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.lastChild.offsetTop; 
      };
    };
  };

  function onFocus() {
    if (!isMobile) {
      scrollToBottomOfChatDesktop();
    } else {
      setPaddingBottom('0px');
      scrollToBottomOfChat();
    };
  };

  function onBlur() {
    setPaddingBottom('10px');
  };

  function reduceString(string) {
    return string.substring(0, 10) + (string.length > 10 ? '...' : '');
  };

  return (
    <div className={!isMobile ? Styles.chatContainer : Styles.chatContainerMobile}>
      <div className={!isMobile ? Styles.playerNameContainer : Styles.playerNameContainerMobile}>
        <div className={Styles.closeButtonTop} onClick={stopChatMode}>Close</div>
        <div className={Styles.playerName}>{state.otherUser.length > 0 && reduceString(state.otherUser[0].username.split(' ')[0])}</div>
      </div>
      <div className={!isMobile ? Styles.anotherContainer : Styles.anotherContainerMobile} style={{paddingBottom: paddingBottom}}>
        <div className={Styles.subContainer}>
          <div 
            className={Styles.closeButton} 
            onClick={!isMobile ? stopChatMode : closeKeyboard}>
            X
          </div>
          <input
            ref={inputRef}
            placeholder={'Say hi'}
            onChange={setInput}
            className={Styles.chatInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={isMobile ? onBlur : null}
            value={message}
            autoComplete="on"
            autoFocus={true}
          />
          <div
            className={Styles.sendMessage} 
            onClick={sendMessageMethod}>
            send
          </div>
        </div>
        <div className={Styles.line}/>
      </div>
      <div className={!isMobile ? Styles.mainMessageContainer : Styles.mainMessageContainerMobile} ref={messageContainerRef}>
        {state.chat.map((message, i) => {
          let component;
          message.clientID !== state.clientID ?
            component = (
              <div className={Styles.messageContainerLeft} key={message.clientID + i}>
                <div className={Styles.chatLeft}>{message.message}</div>
              </div>
            )
            :
            component = (
              <div className={Styles.messageContainerRight} key={state.clientID + i}>
                <div className={Styles.chatRight}>{message.message}</div>
              </div>
            )
            return component
        })}
      </div>
    </div>
  );
};