import React from 'react'
import { render, waitForElement } from 'react-testing-library'
import SectionTitle from '../SectionTitle'

it('renders without crashing', () => {
  render(<SectionTitle />)
})

it('renders the section name', async () => {
  const { getByText } = render(<SectionTitle sectionName="section name" />)
  await waitForElement(() => getByText('section name'))
})

it('renders its children', async () => {
  const { getByText } = render(<SectionTitle>Content</SectionTitle>)
  await waitForElement(() => getByText('Content'))
})
