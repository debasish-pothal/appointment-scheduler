import React, { Component } from 'react';
import './style/App.css';

import AddAppointment from './components/AddAppointment';
import SearchAppointment from './components/SearchAppointment';
import ListAppointment from './components/ListAppointment';

import { without } from 'lodash';

class App extends Component {
  constructor() {
    super();
    this.state = {
      appointments: [],
      formDisplay: false,
      orderBy: 'petName',
      orderDir: 'asc'
    }
  }

  componentDidMount() {
    fetch('./data.json').then(res => res.json()).then(resp => {
      const apts = resp.map((item, index) => {
        item.aptId = `apt-${index}`;
        return item;
      });
      this.setState({
        appointments: apts
      });
    }).catch(err => {
      console.log(err);
    });
  }

  deleteAppointment(apt) {
    const oldApts = this.state.appointments;
    const newApts = without(oldApts, apt);

    this.setState({
      appointments: newApts
    });
  }

  toggleFormDisplay() {
    const toggle = !this.state.formDisplay;
    this.setState({
      formDisplay: toggle
    });
  }

  addAppointment(formData) {
    const oldApts = this.state.appointments;
    formData.aptId = `apt-${oldApts.length}`;

    oldApts.unshift(formData);

    this.setState({
      appointments: oldApts
    });
  }

  handleOrder(by, dir) {
    this.setState({
      orderBy: by,
      orderDir: dir
    });
  }

  render() {
    let order = this.state.orderBy === 'asc' ? 1 : -1;
    let filteredApts = this.state.appointments;

    filteredApts.sort((a, b) => {
      if (a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()) {
        return -1 * order;
      } else {
        return 1 * order;
      }
    });

    return (
      <main id="percentage" className="page bg-white">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointment formDisplay={this.state.formDisplay} toggleFormDisplay={this.toggleFormDisplay.bind(this)} addAppointment={this.addAppointment.bind(this)}/>
                <SearchAppointment orderBy={this.state.orderBy} orderDir={this.state.orderDir} handleOrder={this.handleOrder.bind(this)} />
                <ListAppointment appointments={filteredApts} deleteAppointment={this.deleteAppointment.bind(this)} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
