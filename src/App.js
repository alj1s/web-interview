import React, { Component } from 'react'
import {
  FaStethoscope,
  FaVideo,
  FaClock,
  FaCommentAlt,
  FaImages,
} from 'react-icons/fa'

import { API_ENDPOINT } from './config'
import {
  Header,
  SelectButton,
  SectionBody,
  SectionTitle,
  User,
} from './components'

import './App.scss'

import { consultantTypes, appointmentTypes } from './constants'

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

  canBookAppointment = () => {
    return (
      !!this.state.selectedConsultantType &&
      !!this.state.selectedAppointmentType &&
      !!this.state.selectedAppointmentTime
    )
  }

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

  selectConsultantType = consultantType => {
    const availableSlots = this.calculateAvailableSlots(consultantType)
    this.setState({
      availableSlots,
      selectedAppointmentTime: availableSlots[0],
      selectedConsultantType: consultantType,
    })
  }

  render() {
    const { firstName, lastName, avatar } = this.state.currentUser

    return (
      <div className="app">
        <Header />

        <main>
          <h1>New Appointment</h1>

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
                  onSelect={() => this.selectConsultantType(consultantType)}
                >
                  {consultantType}
                </SelectButton>
              ))}
              <p>{'Babylon ' + this.state.selectedConsultantType}</p>
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
              {this.state.availableSlots.length === 0 && (
                <p>No slots available</p>
              )}
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
            <SectionTitle sectionName="Notes">
              <FaCommentAlt size={'1.5rem'} />
            </SectionTitle>
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
            <SectionTitle sectionName="Attach a photo">
              <FaImages size={'1.5rem'} />
            </SectionTitle>
            <SectionBody>
              <button className="add-photo-button">+</button>
            </SectionBody>
          </section>
        </main>

        <button
          disabled={!this.canBookAppointment()}
          className="book-appointment"
          onClick={() => this.canBookAppointment() && this.bookAppointment()}
        >
          Book
        </button>
      </div>
    )
  }
}

export default App
