import React, { Component } from 'react'

import logo from './logo.png'
import { API_ENDPOINT } from './config'
import { User } from './components'

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
    this.userId = 1

    this.state = {
      selectedConsultantType: consultantTypes[0],
      selectedAppointmentType: appointmentTypes[0],
      currentUser: {},
      availableSlots: [],
    }
  }

  componentDidMount() {
    fetch(`${API_ENDPOINT}/users/${this.userId}`)
      .then(res => res.json())
      .then(json => this.setState({ currentUser: json }))

    fetch(`${API_ENDPOINT}/availableSlots`)
      .then(res => res.json())
      .then(json => {
        this.allAvailableSlots = json
        this.setState({
          availableSlots: this.calculateAvailableSlots(
            this.state.selectedConsultantType
          ),
        })
      })
      .catch(() => {
        // TODO: Handle error here
      })
  }

  onClick() {
    this.setState({ selectedAppointmentType: 'gp' })
  }

  calculateAvailableSlots = consultantType =>
    this.allAvailableSlots
      .filter(slot =>
        slot.consultantType.includes(consultantType.toLowerCase())
      )
      .map(slot => slot.time)

  render() {
    const { firstName, lastName, avatar } = this.state.currentUser

    return (
      <main className="app">
        <header className="app-header">
          <img src={logo} className="app-logo" alt="Babylon Health" />
        </header>

        <h1>New appointment</h1>

        <User firstName={firstName} lastName={lastName} avatar={avatar} />

        <section>
          <h2>Consultant Type</h2>
          {consultantTypes.map(consultantType => (
            <button
              key={consultantType}
              className="button"
              onClick={() =>
                this.setState({
                  selectedConsultantType: consultantType,
                  availableSlots: this.calculateAvailableSlots(consultantType),
                })
              }
            >
              {consultantType}
            </button>
          ))}
        </section>

        <section>
          <h2>Date & Time</h2>
          {this.state.availableSlots.map(slot => (
            <button
              key={slot}
              className="button"
              onClick={() => {
                this.setState({ selectedAppointment: slot })
              }}
            >
              {slot}
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
