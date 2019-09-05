import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Bling as GPT} from "react-gpt";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <GPT
          adUnitPath="/4595/nfl.test.open"
          slotSize={[728, 90]}
        />

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
