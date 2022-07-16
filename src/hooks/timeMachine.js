import { useState } from 'react';

export default function useTimeMachine(squares, dispatch) {
  
  const [history, updateHistory] = useState([{squares: squares}]);
  const [step, updateStep] = useState(0);
  const currentHistory = history.slice(0, step + 1);
  const doesNotContainCurrentSquares = currentHistory.every(item => {
    const currentHistoryArray = JSON.stringify(item.squares);
    const currentArray = JSON.stringify(squares);
    if (currentHistoryArray !== currentArray) {
      return true;
    };
    return false;
  });

  if (doesNotContainCurrentSquares) {
    updateHistory(currentHistory.concat([{squares: squares}]));
    updateStep(currentHistory.length);
  };

  function jumpToSquares(move) {
    const updateCurrent = history[move];
    const squares = updateCurrent.squares;
    const isXNext = (move % 2) === 0;
    updateStep(move);
    dispatch({type: 'UPDATE_SQUARES', squares: squares, isXNext: isXNext});
  };

  function resetHistory() {
    updateHistory([{squares: Array(9).fill(null)}]);
  };

  return {
    history, 
    jumpToSquares,
    resetHistory
  };
};