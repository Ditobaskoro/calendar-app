import React, { Component } from 'react';
import './index.css';
import Calendar from '../Calendar';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Calendar />
      </div>
    );
  }
}

export default App;
