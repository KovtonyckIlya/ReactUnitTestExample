import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Board from '../components/Board';
import Reset from '../components/Reset';
import renderer from 'react-test-renderer';
import styles from 'styles/Board.css';
import squareStyles from 'styles/Square.css';
import gameReducer from '../reducer/gameReducer';

let container;

//If test does require dispatch then i pass in a real dispatch from the reducer
function BoardWithReducer () {
  const [state, dispatch] = useReducer(gameReducer, {
    squares: Array(9).fill(null),
    isXNext: true,
    multiplayer: false
  });
  return <Board state={state} dispatch={dispatch}/>
};

//Im testing these two together because reset component resets the squares in the board component they are closely related.
function BoardAndResetWithReducer () {
  const [state, dispatch] = useReducer(gameReducer, {
    squares: Array(9).fill(null),
    isXNext: true,
    multiplayer: false
  });
  //Im not testing this function so im passing a mock
  const resetHistory = jest.fn();
  return (
    <div>
      <Board state={state} dispatch={dispatch}/>
      <Reset resetHistory={resetHistory} dispatch={dispatch}/>
    </div>
  );
};
//If test does not require dispatch is decided to use this
function BoardWithMock () {
  const state = {squares: Array(9).fill(null), isXNext: false};
  const dispatch = jest.fn();
  return <Board state={state} dispatch={dispatch} />
};

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('Renders without crashing', () => {
  ReactDOM.render(<BoardWithMock />, container);
});

it('Renders correctly', () => {
  const tree = renderer.create(<BoardWithMock />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should render 5 divs', () => {
  act(() => {
    ReactDOM.render(<BoardWithMock />, container);
  });
  const divs = container.querySelectorAll('div');
  expect(divs.length).toEqual(5);
});

it('Each row should have 3 columns.', () => {
  act(() => {
    ReactDOM.render(<BoardWithMock />, container);
  });
  const boardRows = container.querySelectorAll('.' + styles.boardRow);
  boardRows.forEach(row => {
    expect(row.children.length).toEqual(3);
  });
});

it('Board updates with X and O when user clicks on it and renders proper status.', () => {
  act(() => {
    ReactDOM.render(<BoardWithReducer />, container);
  });
  const squares = container.querySelectorAll('button');
  const status = container.querySelector('#status');
  expect(squares[0].textContent).toBe('');
  act(() => {
    squares[0].dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(status.innerHTML).toBe('Next player: O');
  expect(squares[0].textContent).toBe('X');
  expect(squares[1].textContent).toBe('');
  act(() => {
    squares[1].dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(status.innerHTML).toBe('Next player: X');
  expect(squares[1].textContent).toBe('O');
});

it('Should still only render 5 divs if all squares are selected and the game was a tie.', () => {
  act(() => {
    ReactDOM.render(<BoardWithReducer />, container);
  });
  const squares = container.querySelectorAll('button');
  const orderOfClicksByIndex = [0,1,2,4,3,5,7,6,8];
  orderOfClicksByIndex.forEach(index => {
    act(() => {
      squares[index].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  });
  const divs = container.querySelectorAll('div');
  expect(divs.length).toEqual(5);
});

it('Clicking should only change the column that was clicked, dont change the numbers on chunkIndex Variable.', () => {
  act(() => {
    ReactDOM.render(<BoardWithReducer />, container);
  });
  const squares = container.querySelectorAll('.' + squareStyles.square);
  act(() => {
    squares[2].dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  squares.forEach((_, index) => {
    if (index !== 2) {
      expect(squares[index].textContent).toBe('');
    }
  })
});

it('Should display winner when someone wins with their symbol', () => {
  act(() => {
    ReactDOM.render(<BoardWithReducer />, container);
  });
  const squares = container.querySelectorAll('button');
  const orderOfClicksforXtoWin = [0,1,4,2,8];
  orderOfClicksforXtoWin.forEach(index => {
    act(() => {
      squares[index].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  });
  const status = container.querySelector('#status');
  expect(status.innerHTML).toBe('Winner: X');
});

it('If game was a tie status should be Game was a tie.', () => {
  act(() => {
    ReactDOM.render(<BoardWithReducer />, container);
  });
  const squares = container.querySelectorAll('button');
  const orderOfClicksByIndex = [0,1,2,4,3,5,7,6,8];
  const status = container.querySelector('#status');
  orderOfClicksByIndex.forEach(index => {
    act(() => {
      squares[index].dispatchEvent(new MouseEvent('click', {bubbles: true}));
    });
  });
  expect(status.innerHTML).toBe('Game was a tie');
});

it('When you click reset button, the board resets', () => {
  act(() => {
    ReactDOM.render(<BoardAndResetWithReducer />, container);
  });
  const squares = container.querySelectorAll('.' + squareStyles.square);
  const resetButton = container.querySelector('#resetButton');
  const status = container.querySelector('#status');
  act(() => {
    resetButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  squares.forEach((_, index) => {
    expect(squares[index].textContent).toBe('');
  });
  expect(status.innerHTML).toBe('Next player: X');
});