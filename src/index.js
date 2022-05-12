import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Canvas from './Canvas';
import Mandel from './Mandel';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div style={{ backgroundColor: '#ABBAEA' }}>
      <p >TUSHHH</p>
    </div>

    <div style={{ display: 'flex' }}>
      <Mandel />
      <p>lorem ipsum</p>
    </div>
  </React.StrictMode>
);


