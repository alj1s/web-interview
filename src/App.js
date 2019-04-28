import React, { Component } from 'react'
import {
  FaStethoscope,
  FaVideo,
  FaClock,
  FaCommentAlt,
  FaImages,
} from 'react-icons/fa'
import { format } from 'date-fns'

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
      availableSlots: [],
    }
  }

  componentDidMount() {
    fetch(`${API_ENDPOINT}/availableSlots`)
      .then(res => {
        if (res.ok) return res.json()
        else throw Error(res.statusText)
      })
      .then(json => {
        this.allAvailableSlots = json
        const availableSlots = this.calculateAvailableSlots(
          this.state.selectedConsultantType
        )
        this.setState({
          availableSlots,
          selectedAppointmentTime: availableSlots[0],
          slotsError: undefined,
        })
      })
      .catch(error => {
        console.log(error)
        this.setState({ slotsError: 'Could not load available slots' })
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
        if (res.ok) {
          this.setState({
            appointmentNotes: '',
            availableSlots: this.calculateAvailableSlots(
              this.state.selectedConsultantType
            ),
            bookingError: undefined,
            bookingComplete: true,
          })
        } else {
          throw new Error(res.statusText)
        }
      })
      .catch(err => {
        console.error(err)
        this.setState({ bookingError: 'Booking failed. Please try again' })
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
    return (
      <div className="app">
        <Header />

        <main>
          <h1>New Appointment</h1>

          <User userId={this.userId} />

          <section>
            <SectionTitle sectionName="Consultant Type">
              <FaStethoscope className="section-icon" />
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
              <FaClock className="section-icon" />
            </SectionTitle>
            <SectionBody>
              {!this.state.slotsError &&
                this.state.availableSlots.map(slot => (
                  <SelectButton
                    key={slot}
                    isSelected={this.state.selectedAppointmentTime === slot}
                    onSelect={() => {
                      this.setState({ selectedAppointmentTime: slot })
                    }}
                  >
                    {format(slot, 'Do MMM HH:mm')}
                  </SelectButton>
                ))}
              {!this.state.slotsError &&
                this.state.availableSlots.length === 0 && (
                  <p>No slots available</p>
                )}
              {this.state.slotsError && (
                <p className="error">{this.state.slotsError}</p>
              )}
            </SectionBody>
          </section>

          <section>
            <SectionTitle sectionName="Appointment type">
              <FaVideo className="section-icon" />
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
              <FaCommentAlt className="section-icon" />
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
              <FaImages className="section-icon" />
            </SectionTitle>
            <SectionBody>
              <button className="add-photo-button">+</button>
            </SectionBody>
          </section>
        </main>

        {!!this.state.bookingError && (
          <p className="error">{this.state.bookingError}</p>
        )}
        {!this.state.bookingError && this.state.bookingComplete && (
          <p className="success">Booking confirmed</p>
        )}

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
