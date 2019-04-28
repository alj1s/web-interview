import React from 'react'
import { render, waitForElement } from 'react-testing-library'
import { FetchMock } from '@react-mock/fetch'

import User from '../User'
import { API_ENDPOINT } from '../../config'

const mockUrl = `${API_ENDPOINT}/users/1`

it('renders without crashing', () => {
  render(
    <FetchMock
      options={{
        matcher: mockUrl,
        method: 'GET',
        response: {},
      }}
    >
      <User userId={1} />
    </FetchMock>
  )
})

it('renders display the user name', async () => {
  const { getByText } = render(
    <FetchMock
      options={{
        matcher: mockUrl,
        method: 'GET',
        response: { firstName: 'Jane', lastName: 'Doe' },
      }}
    >
      <User userId={1} />
    </FetchMock>
  )
  await waitForElement(() => getByText('Jane Doe'))
})

it('renders an error if the fetch request failed', async () => {
  const { getByText } = render(
    <FetchMock
      options={{
        matcher: mockUrl,
        method: 'GET',
        response: 404,
      }}
    >
      <User userId={1} />
    </FetchMock>
  )
  await waitForElement(() => getByText('Could not load user details'))
})
