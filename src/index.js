// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Optional: if you have any stylesheets
import App from './App'; // Ensure you have an App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
