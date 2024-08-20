import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'
// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.



test('Spinner renders when "on" is true', () => {
  render(<Spinner on={true} />)
  expect(screen.getByText('Please wait...')).toBeInTheDocument()
})


test('Spinner does not render when "on" is false', () => {
  render(<Spinner on={false} />)
  expect(screen.queryByText('Please wait...')).not.toBeInTheDocument()
})