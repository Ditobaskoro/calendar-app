import React, { Component } from 'react';
import './index.css';
import Calendar from '../../containers/Calendar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Calendar/>
      </div>
    );
  }
}

export default App;
