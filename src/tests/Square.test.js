import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Square from '../components/Square';
import renderer from 'react-test-renderer';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('Renders correctly', () => {
  const tree = renderer
    .create(<Square />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

describe('Square', () => {
  it('renders the props passed', () => {
    act(() => {
      ReactDOM.render(<Square value='X'/>, container);
    });
    expect(container.textContent).toEqual('X');
  });
});
