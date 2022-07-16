export default function gameReducer(state, action) {
  const {
    squares,
    isXNext,
    firstMove,
    move,
    gameId,
    roomName,
    username,
    otherUser,
    allPlayers,
    multiplayer,
    gameFull,
    clientID,
    chat,
    gameOver,
    response,
    rematch,
    gamesChanged,
    topBarResponse,
    host
  } = state;

  switch (action.type) {
    case 'SELECT_SQUARE': {
      const currentSquares = squares.slice();
      currentSquares[action.index] = isXNext ? 'X' : 'O';
      return {
        ...state,
        squares: currentSquares,
        isXNext: !isXNext
      }
    }
    case 'UPDATE_SQUARES': {
      return {
        ...state,
        squares: action.squares,
        isXNext: action.isXNext
      }
    }
    case 'RESET_SQUARE': {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true
      }
    }
    case 'createGame': {
      return {
        ...state,
        gameId: action.data.gameId,
        roomName: action.data.roomName,
        move: action.data.move,
        username: action.data.username,
        clientID: action.data.clientID,
        multiplayer: true,
        host: true
      };
    } 
    case 'joinGame': {
      return {
        ...state,
        gameId: action.data.gameId,
        move: action.data.move,
        roomName: action.data.roomName,
        username: action.data.username,
        clientID: action.data.clientID,
        multiplayer: true,
        host: false
      };
    }
    case 'notifyAllUsers': {
      const you = {username: username, move: move, clientID: clientID, host: host};
      const otherUser = action.data.users.filter(user => user.move !== move);
      const players = [you].concat(otherUser[0]);

      return {
        ...state,
        otherUser: otherUser,
        allPlayers: players,
        isXNext: action.data.users[0].move === 'X' ? true : false,
        firstMove: action.data.users[0].move,
        response: {
          type: 'userJoined',
          userThatJoined: action.data.userThatJoined
        },
        gameFull: true
      };
    }
    case "updateSquares": {
      const currentSquares = squares.slice();
      currentSquares[action.data.index] = isXNext ? 'X' : 'O';
      return {
        ...state,
        squares: currentSquares,
        isXNext: !isXNext
      };
    }
    case "messageDelivered": {
      return {
        ...state,
        delivered: true
      };
    }
    case "newMessages" : {
      const newMessages = chat.concat({
        message: action.data.message,
        clientID: action.data.clientID,
        username: action.data.username
      })
      return {
        ...state,
        chat: newMessages,
        response: {
          type: 'latestMessage',
          username: action.data.username,
          message: action.data.message
        }
      }
    }
    case "UPDATE_USERNAME": {
      return {
        ...state,
        username: action.username
      };
    }
    case "leaveGame": {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true,
        move: null,
        gameId: null,
        roomName: null,
        rematch: false,
        gameOver: false,
        allPlayers: [],
        otherUser: [],
        host: false,
        multiplayer: false,
        gameFull: false,
        chat: []
      };
    }
    case "kicked": {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true,
        move: null,
        gameId: null,
        roomName: null,
        rematch: false,
        gameOver: false,
        allPlayers: [],
        otherUser: [],
        host: false,
        multiplayer: false,
        gameFull: false,
        chat: [],
        topBarResponse: {
          type: 'MESSAGE',
          message: 'You got kicked lol'
        }
      }
    }
    case "playerwaskicked": {
      return {
        ...state,
        squares: Array(9).fill(null),
        rematch: false,
        gameOver: false,
        allPlayers: [],
        otherUser: [],
        gameFull: false,
        host: true,
        chat: []
      }
    }
    case "notifyUserLeft": {
      return {
        ...state,
        squares: Array(9).fill(null),
        rematch: false,
        gameOver: false,
        allPlayers: [],
        otherUser: [],
        gameFull: false,
        host: true,
        chat: [],
        response: {
          type: 'userLeft',
          username: action.data.username
        }
      }
    }
    case "GAME_OVER": {
      return {
        ...state,
        gameOver: true
      }
    }
    case "CLEAR_RESPONSE": {
      return {
        ...state,
        response: {}
      }
    }
    case "removeRematchButton": {
      return {
        ...state,
        rematch: true
      }
    }
    case "rematch": {
      return {
        ...state,
        response: {
          type: 'rematch',
          username: action.data.username
        }
      }
    }
    case "rematchStart" : {
      return {
        ...state,
        response: {
          type: 'rematchStarted'
        },
        rematch: false,
        squares: Array(9).fill(null),
        isXNext: firstMove === 'X' ? false : true,
        firstMove: firstMove === 'X' ? 'O' : 'X',
        gameOver: false
      }
    }
    case "error" : {
      return {
        ...state,
        topBarResponse: {
          type: "ERROR",
          message: action.data.message 
        }
      }
    }
    case "playerDisconnect" : {
      return {
        ...state,
        gameFull: false,
        allPlayers: [],
        otherUser: [],
        response: {
          type: 'playerDisconnect',
          playerName: action.data.player.username
        },
        rematch: false,
        squares: Array(9).fill(null),
        isXNext: true,
        gameOver: false,
        chat: [],
      }
    }
    case "gamesChanged" : {
      return {
        ...state,
        gamesChanged: !gamesChanged,
        topBarResponse: {
          type: 'gamesUpdated'
        }
      };
    }
    case "RESET_STATE" : {
      return {
        ...state,
        squares: Array(9).fill(null),
        isXNext: true,
        move: null,
        gameId: null,
        roomName: null,
        allPlayers: [],
        otherUser: [],
        multiplayer: false,
        gameFull: false,
        clientID: null,
        chat: [],
        gameOver: false,
        response: {},
        rematch: false,
        error: false,
        gamesChanged: false
      }
    }
    case "TOP_BAR_RESPONSE" : {
      return {
        ...state,
        topBarResponse: {
          type: action.data.type,
          message: action.data.message
        }
      }
    }
    case "CLEAR_TOP_BAR_RESPONSE" : {
      return {
        ...state,
        topBarResponse: {}
      }
    }
  };
};