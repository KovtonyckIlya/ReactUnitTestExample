import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game';
import './body.css';

let isMobile = true;
let component;

if (!isMobile) {
  component = (
    <div 
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
    <div style={{width: '500px'}}>
      <Game config={{environment: 'development', isMobile: false}} />
    </div>
  </div>
  );
} else {
  component = (
    <div>
      <Game config={{environment: 'development', isMobile: true}} />
    </div>
  );
};

ReactDOM.render(component, document.getElementById('root'));