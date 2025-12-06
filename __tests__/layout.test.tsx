/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'

// Mock next/font/google so the test is deterministic about the returned className
jest.mock('next/font/google', () => ({
  Inter: (_opts: any) => ({ className: 'test-inter', variable: '--font-inter' }),
}))

// Mock CSS import used by layout so Jest doesn't try to parse the stylesheet
jest.mock('@/app/globals.css', () => ({}))

import { inter as interExport } from '../src/app/layout'

test('layout exports inter with className (mocked)', () => {
  expect(interExport.className).toBe('test-inter')
})
