import React, { Component } from 'react';
import './index.css';
import dateFns from 'date-fns';
import moment from 'moment';
import { Modal, Button, Input, TimePicker, Select } from 'antd';

export default class Calendar extends Component { 
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    events: [],
    currentEvent: {
      day: null,
      name: '',
      time: moment('00:00:00', 'HH:mm:ss'),
      invitees: []
    },
    index: null,
    modal1: false,
  };
  componentDidMount() {
    const data = localStorage.getItem('data');
    if(data){
      this.setState({
        events: JSON.parse(data),
      })
    }
  }
  submitEvent = (e) => {
    const { events, currentEvent, index } = this.state;
    let arr = [];
    if(!index && index !== 0){
      arr = events.slice();
      arr.push(currentEvent);
    } else {  
      arr = events.slice();
      arr[index] = currentEvent;
    }
    
    if(currentEvent.day && currentEvent.name && currentEvent.time){
      localStorage.setItem('data', JSON.stringify(arr));
      this.setState({
        events: arr,
        currentEvent: {
          day: null,
          name: '',
          time: moment('00:00:00', 'HH:mm:ss'),
          invitees: []
        },
        index: null,
        modal1: false,
      });
    }
    
  }
  editEvent = (event,index) => {
    let currentEvent = Object.assign({}, event);
    currentEvent.time = moment(event.time);
    this.setState({
      modal1: true,
      index: index,
      currentEvent: currentEvent,
    })
  }
  deleteEvent = () => {
    const { events, index } = this.state;
    let arr = events.slice();
    arr.splice(index, 1);

    localStorage.setItem('data', JSON.stringify(arr));
    
    this.setState({
      modal1: false,
      events: arr,
      currentEvent: {
        day: null,
        name: '',
        time: moment('00:00:00', 'HH:mm:ss'),
        invitees: []
      },
      index: null,
    })
  }
  handleCancel = (e) => {
    this.setState({
      modal1: false,
    });
  }
  
  onNameChange = (e) => {
    let currentEvent = Object.assign({}, this.state.currentEvent);
    currentEvent.name = e.target.value;
    currentEvent.day = this.state.selectedDate;
    this.setState({currentEvent})
  }
  onTimeChange = (time) => {
    let currentEvent = Object.assign({}, this.state.currentEvent);
    currentEvent.time = time;
    this.setState({currentEvent})
  }
  onInviteeChange = (value) => {
    let currentEvent = Object.assign({}, this.state.currentEvent);
    currentEvent.invitees = value;
    this.setState({currentEvent})
  }
  renderHeader() {
    const dateFormat = "MMMM YYYY";
    return (
      <div className="header row flex-middle">
        <div className="col col-center">
          <span>
            {dateFns.format(this.state.currentMonth, dateFormat)}
          </span>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate, events } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        const todayEvents = [];
        events.map(item => dateFns.isSameDay(item.day, cloneDay) && todayEvents.push(item));
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => todayEvents.length < 3 && this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <div className="event-div">
              {events.map((item,i) => {
                if(dateFns.isSameDay(item.day, cloneDay)){
                  return <li key={i} onClick={() => this.editEvent(item,i)} className="event">{item.name}</li>;
                }  
              })}
            </div>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    this.setState({
      selectedDate: day,
      modal1: true,
    });
  };

  addEventModal() {
    const { currentEvent, index } = this.state;
    return (
      <Modal
          title="Add Event"
          visible={this.state.modal1}
          onOk={this.submitEvent}
          onCancel={this.handleCancel}
        >
        <p className="form-title">Event Name: </p>
        <Input value={currentEvent.name} placeholder="Event Name" onChange={this.onNameChange}/>
        <p className="form-title">Time: </p>
        <TimePicker value={currentEvent.time} onChange={this.onTimeChange} defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} />
        <p className="form-title">Invitees List: (separated by coma)</p>
        <Select
        mode="tags"
        style={{ width: '100%' }}
        onChange={this.onInviteeChange}
        value={currentEvent.invitees}
        tokenSeparators={[',']}/>
        {index !== null &&<Button className="form-button" onClick={this.deleteEvent} type="danger">Delete Event</Button>}
      </Modal>
    );
  }

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {this.addEventModal()}
      </div>
    );
  }
}
