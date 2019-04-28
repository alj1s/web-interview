import React from 'react'
import { render, waitForElement, fireEvent } from 'react-testing-library'
import { FetchMock } from '@react-mock/fetch'

import SelectButton from '../SelectButton'

it('renders without crashing', () => {
  render(<SelectButton />)
})

it('renders its children', async () => {
  const { getByText } = render(<SelectButton>Button Text</SelectButton>)
  await waitForElement(() => getByText('Button Text'))
})

it('involes on onSelect handler on selection', async () => {
  const onSelect = jest.fn()
  const { getByText } = render(
    <SelectButton onSelect={onSelect}>Button Text</SelectButton>
  )
  fireEvent.click(getByText('Button Text'))
  expect(onSelect).toHaveBeenCalled()
})
