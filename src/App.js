import React, { Component } from 'react'
import { FaStethoscope, FaVideo, FaClock, FaChat } from 'react-icons/fa'

import { API_ENDPOINT } from './config'
import {
  Header,
  SelectButton,
  SectionBody,
  SectionTitle,
  User,
} from './components'

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
      .catch(() => {
        // TODO: Handle errors
      })

    fetch(`${API_ENDPOINT}/availableSlots`)
      .then(res => res.json())
      .then(json => {
        this.allAvailableSlots = json
        const availableSlots = this.calculateAvailableSlots(
          this.state.selectedConsultantType
        )
        this.setState({
          availableSlots,
          selectedAppointmentTime: availableSlots[0],
        })
      })
      .catch(() => {
        // TODO: Handle error here
      })
  }

  calculateAvailableSlots = consultantType =>
    this.allAvailableSlots
      .filter(slot =>
        slot.consultantType.includes(consultantType.toLowerCase())
      )
      .map(slot => slot.time)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))

  bookAppointment = () => {
    fetch(`${API_ENDPOINT}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.userId,
        dateTime: this.state.selectedAppointmentTime,
        notes: this.state.appointmentNotes,
        type: `${this.state.selectedConsultantType} appointment`,
      }),
    })
      .then(res => {
        console.log(res)
        this.setState({
          appointmentNotes: '',
          availableSlots: this.calculateAvailableSlots(
            this.state.selectedConsultantType
          ),
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  render() {
    const { firstName, lastName, avatar } = this.state.currentUser

    return (
      <div className="app">
        <Header />

        <main>
          <h1>New appointment</h1>

          <User firstName={firstName} lastName={lastName} avatar={avatar} />

          <section>
            <SectionTitle sectionName="Consultant Type">
              <FaStethoscope size={'1.5rem'} />
            </SectionTitle>
            <SectionBody>
              {consultantTypes.map(consultantType => (
                <SelectButton
                  key={consultantType}
                  isSelected={
                    this.state.selectedConsultantType === consultantType
                  }
                  onSelect={() =>
                    this.setState({
                      selectedConsultantType: consultantType,
                      availableSlots: this.calculateAvailableSlots(
                        consultantType
                      ),
                    })
                  }
                >
                  {consultantType}
                </SelectButton>
              ))}
            </SectionBody>
          </section>

          <section>
            <SectionTitle sectionName="Date & Time">
              <FaClock size={'1.5rem'} />
            </SectionTitle>
            <SectionBody>
              {this.state.availableSlots.map(slot => (
                <SelectButton
                  key={slot}
                  isSelected={this.state.selectedAppointmentTime === slot}
                  onSelect={() => {
                    this.setState({ selectedAppointmentTime: slot })
                  }}
                >
                  {slot}
                </SelectButton>
              ))}
            </SectionBody>
          </section>

          <section>
            <SectionTitle sectionName="Appointment type">
              <FaVideo size={'1.5rem'} />
            </SectionTitle>
            <SectionBody>
              {appointmentTypes.map(appointmentType => (
                <SelectButton
                  key={appointmentType}
                  isSelected={
                    this.state.selectedAppointmentType === appointmentType
                  }
                  onSelect={() =>
                    this.setState({ selectedAppointmentType: appointmentType })
                  }
                >
                  {appointmentType}
                </SelectButton>
              ))}
            </SectionBody>
          </section>

          <section>
            <h2>Notes</h2>
            <SectionBody>
              <textarea
                value={this.state.appointmentNotes}
                placeholder="Describe your symptoms"
                onChange={e =>
                  this.setState({ appointmentNotes: e.target.value })
                }
              />
            </SectionBody>
          </section>

          <section>
            <h2>Attach a photo</h2>
            <SectionBody>
              <button className="add-photo-button">+</button>
            </SectionBody>
          </section>
        </main>
        <button
          className="book-appointment"
          onClick={() => this.bookAppointment()}
        >
          Book
        </button>
      </div>
    )
  }
}

export default App
