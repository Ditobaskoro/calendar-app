import React, { Component } from 'react';
import './index.css';
import { withFirebase } from '../../components/Firebase';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: {},
    };
  }
  componentDidMount() {
    if(this.props.firebase){
      this.props.firebase.events().on('value', snapshot => {
        this.setState({
          events: snapshot.val(),
        });
      });
    }   
  } 
  render() {
    const { events } = this.state;
    console.log('ev',events);
    return (
      <div className="calendar-view">
        <h1>Welcome</h1>
      </div>
    );
  }
}

export default withFirebase(Calendar);