import React from 'react'
import { fireEvent, render, waitForElement } from 'react-testing-library'
import { FetchMock, fetchMock } from '@react-mock/fetch'

import App from './App'
import { API_ENDPOINT } from './config'

jest.mock('./components/User')

const availableSlotsUrl = `${API_ENDPOINT}/availableSlots`
const createBookingUrl = `${API_ENDPOINT}/appointments`

it('renders without crashing', () => {
  render(<App />)
})

it('shows available appointments by consultant type', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['gp'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
  ]

  const { getByText } = render(
    <FetchMock
      options={{
        matcher: availableSlotsUrl,
        method: 'GET',
        response: availableSlots,
      }}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('28th Apr 11:00'))
})

it('shows an error if the availableSlots request fails', async () => {
  const { getByText } = render(
    <FetchMock
      options={{
        matcher: availableSlotsUrl,
        method: 'GET',
        response: 500,
      }}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('Could not load available slots'))
})

it('filters appointments when changing consultant type', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['gp'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
    {
      id: '2',
      consultantType: ['nurse'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-29T10:00:00.000Z',
    },
  ]

  const { getByText } = render(
    <FetchMock
      options={{
        matcher: availableSlotsUrl,
        method: 'GET',
        response: availableSlots,
      }}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('28th Apr 11:00'))
  fireEvent.click(getByText('Nurse'))
  await waitForElement(() => getByText('29th Apr 11:00'))
})

it('shows message if there are no available appointments', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['specialist'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
  ]

  const { getByText } = render(
    <FetchMock
      options={{
        matcher: availableSlotsUrl,
        method: 'GET',
        response: availableSlots,
      }}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('No slots available'))
})

it('allows you to select video or audio appointment', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['specialist'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
  ]

  const { getByText } = render(
    <FetchMock
      options={{
        matcher: availableSlotsUrl,
        method: 'GET',
        response: availableSlots,
      }}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('Video'))
  fireEvent.click(getByText('Video'))
})

it('allows you to add notes', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['specialist'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
  ]

  const { getByPlaceholderText, getByText } = render(
    <FetchMock
      options={{
        matcher: availableSlotsUrl,
        method: 'GET',
        response: availableSlots,
      }}
    >
      <App />
    </FetchMock>
  )

  fireEvent.change(getByPlaceholderText('Describe your symptoms'), {
    target: { value: 'appointment note' },
  })
  await waitForElement(() => getByText('appointment note'))
})

it('allows you to create a booking', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['gp'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
  ]

  const { getByText } = render(
    <FetchMock
      mocks={[
        {
          matcher: availableSlotsUrl,
          method: 'GET',
          response: availableSlots,
        },
        {
          matcher: createBookingUrl,
          method: 'POST',
          response: availableSlots,
        },
      ]}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('28th Apr 11:00'))
  fireEvent.click(getByText('28th Apr 11:00'))
  fireEvent.click(getByText('Book'))
  await waitForElement(() => getByText('Booking confirmed'))
})

it('shows an error if the booking failed', async () => {
  const availableSlots = [
    {
      id: '1',
      consultantType: ['gp'],
      appointmentType: ['audio', 'video'],
      time: '2019-04-28T10:00:00.000Z',
    },
  ]
  const { getByText } = render(
    <FetchMock
      mocks={[
        {
          matcher: availableSlotsUrl,
          method: 'GET',
          response: availableSlots,
        },
        {
          matcher: createBookingUrl,
          method: 'POST',
          response: 500,
        },
      ]}
    >
      <App />
    </FetchMock>
  )

  await waitForElement(() => getByText('28th Apr 11:00'))
  fireEvent.click(getByText('28th Apr 11:00'))
  fireEvent.click(getByText('Book'))
  await waitForElement(() => getByText('Booking failed. Please try again'))
})
