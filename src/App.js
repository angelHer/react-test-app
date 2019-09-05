import React from 'react';
import logo from './logo.svg';
import './App.css';

// Components
import MainServer from './components/main_server';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <MainServer />
      </header>
    </div>
  );
}

export default App;
