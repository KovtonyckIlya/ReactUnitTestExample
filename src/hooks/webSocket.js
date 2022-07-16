import { useState, useEffect } from 'react';

export default function useWebSocket(state, dispatch, socketUrl) {

  const [socket, setSocket] = useState(null);
  const [reconnect, setReconnect] = useState(null);
  const [reconnectTimeOut, setReconnectTimeOut] = useState(null);

  useEffect(() => {
    if (reconnect === null || reconnect === true) {
      const urlParams = new URLSearchParams(window.location.search);
      const clientID = urlParams.get('clientID');
      let url = socketUrl;
      if (state.clientID || clientID) {
        const urlClientID = state.clientID ? state.clientID : clientID;
        url += `?clientID=${urlClientID}`;
      };
      let s = new WebSocket(url);
      setSocket(s);
    };
  }, [reconnect]);

  useEffect(() => {
    let unMount;
    if (socket !== null) {
      unMount = () => {
        socket.close(4001);
        socket.removeEventListener('open', openSocket);
        socket.removeEventListener('message', createSocketEvents);
        socket.removeEventListener('close', closeSocket);
        socket.removeEventListener('error', error);
        window.removeEventListener('beforeunload', unMount);
        window.removeEventListener('pagehide', unMount);
      };
      socket.addEventListener('open', openSocket);
      socket.addEventListener('message', createSocketEvents);
      socket.addEventListener('close', closeSocket);
      socket.addEventListener('error', error);
      window.addEventListener('beforeunload', unMount);
      window.addEventListener('pagehide', unMount);
    };
    return () => {
      if (typeof unMount === 'function') {
        unMount();
      };
    };
  }, [socket]);

  function openSocket() {
    const urlParams = new URLSearchParams(window.location.search);
    const clientID = urlParams.get('clientID');
    const username = urlParams.get('username');
    const gameId = urlParams.get('gameId');
    const token = urlParams.get('token');
    if (clientID) {
      const message = {
        type: 'joinFromInvite',
        name: localStorage.getItem('username'),
        username: username,
        gameId: gameId,
        token: token,
        clientID: clientID
      };
      socket.send(JSON.stringify(message))
    };
    if (reconnect) {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: "MESSAGE",
          message: 'Back online',
        }
      });
      setReconnect(false);
      clearTimeout(reconnectTimeOut);
    };
  };

  function createSocketEvents(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'redirectError') {
      window.location.replace(data.url);
    } else {
      dispatch({
        type: data.type,
        data: data
      });
    };
  };

  function closeSocket() {
    dispatch({
      type: 'TOP_BAR_RESPONSE',
      data: {
        type: 'ERROR',
        message: 'Lost connection attempting to reconnect.'
      }
    });
    setTimeout(() => {
      setReconnect(true);
    }, 300);
    setReconnectTimeOut(setTimeout(() => {
      socket.close(4001);
      dispatch({type: 'RESET_STATE'});
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: 'Failed to reconnect try refreshing page.'
        }
      });
    }, 5000))
  };

  function error() {
    dispatch({
      type: 'TOP_BAR_RESPONSE',
      data: {
        type: 'ERROR',
        message: 'Something went wrong please refresh page.'
      }
    });
  };

  function sendMessage(message) {
    if (socket.readyState === 3) {
      dispatch({
        type: 'TOP_BAR_RESPONSE',
        data: {
          type: 'ERROR',
          message: 'No current connection to server, please refresh page.'
        }
      });
      return;
    };
    socket.send(JSON.stringify(message))
  };

  return { sendMessage };
};