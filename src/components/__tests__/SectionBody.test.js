import React from 'react'
import { render, waitForElement } from 'react-testing-library'
import SectionBody from '../SectionBody'

it('renders without crashing', () => {
  render(<SectionBody />)
})

it('renders its children', async () => {
  const { getByText } = render(<SectionBody>Content</SectionBody>)
  await waitForElement(() => getByText('Content'))
})
