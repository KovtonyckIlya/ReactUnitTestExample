import { useReducer} from 'react';
import gameReducer from '../reducer/gameReducer';

export default function useGameReducer () {
  const [state, dispatch] = useReducer(gameReducer, {
    squares: Array(9).fill(null),
    isXNext: true,
    move: null,
    gameId: null,
    roomName: null,
    username: '',
    allPlayers: [],
    otherUser: [], //changed
    multiplayer: false, //changed
    gameFull: false, // changed
    clientID: null,
    chat: [],
    gameOver: false,
    response: {},
    rematch: false,
    error: false,
    gamesChanged: false,
    topBarResponse: {},
    host: false //changed
  }); 
  return [state, dispatch];
};