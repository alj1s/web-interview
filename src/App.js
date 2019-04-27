import React, { Component } from 'react'

import logo from './logo.png'
import { API_ENDPOINT } from './config'

import './App.scss'

const consultantTypes = [
  'GP',
  'Specialist',
  'Nurse',
  'Therapist',
  'Triage Nurse',
  'Physio',
]

const appointmentTypes = ['Video', 'Audio']

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: 1,
      selectedAppointmentType: 'gp',
      availableSlots: [],
    }
  }

  componentDidMount() {
    fetch(`${API_ENDPOINT}/availableSlots`)
      .then(res => res.json())
      .then(json => {
        this.setState({ availableSlots: json })
      })
      .catch(() => {
        // TODO: Handle error here
      })
  }

  onClick() {
    this.setState({ selectedAppointmentType: 'gp' })
  }

  render() {
    // calculate matching slots
    let slots = []
    for (let i = 0; i < this.state.availableSlots.length; i++) {
      for (
        let j = 0;
        j < this.state.availableSlots[i]['consultantType'].length;
        j++
      ) {
        if (
          this.state.availableSlots[j]['consultantType'][i] ===
          this.state.selectedAppointmentType
        ) {
          slots.push(this.state.availableSlots[j])
        }
      }
    }

    return (
      <main className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="Babylon Health" />
        </header>

        <h1>New appointment</h1>

        <div>User component</div>

        <section>
          <h2>Consultant Type</h2>
          {consultantTypes.map(consultantType => (
            <button
              key={consultantType}
              className="button"
              onClick={() =>
                this.setState({ selectedConsultantType: consultantType })
              }
            >
              {consultantType}
            </button>
          ))}
        </section>

        <section>
          <h2>Date & Time</h2>
          {slots.map(slot => (
            <button
              key={slot}
              className="button"
              onClick={() => {
                this.setState({ selectedAppointment: slot })
              }}
            >
              {slot.time}
            </button>
          ))}
        </section>

        <section>
          <h2>Appointment type</h2>
          {appointmentTypes.map(appointmentType => (
            <button
              key={appointmentType}
              className="button"
              onClick={() =>
                this.setState({ selectedAppointmentType: appointmentType })
              }
            >
              {appointmentType}
            </button>
          ))}
        </section>

        <section>
          <h2>Notes</h2>
          <textarea
            placeholder="Describe your symptoms"
            onChange={e => this.setState({ appointmentNotes: e.target.value })}
          />
        </section>

        <section>
          <h2>Attach a photo</h2>
          <button className="button">+</button>
        </section>

        <button
          className="button"
          onClick={() => {
            /* TODO: submit the data */
          }}
        >
          Book appointment
        </button>
      </main>
    )
  }
}

export default App
