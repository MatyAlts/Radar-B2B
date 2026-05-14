import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignalsDisplay } from './SignalsDisplay'
import { Signal } from '@/lib/api/types'

const createSignal = (overrides?: Partial<Signal>): Signal => ({
  id: '1',
  type: 'expansion',
  name: 'Expansion',
  description: 'Company is expanding',
  active: true,
  points: 20,
  ...overrides,
})

describe('SignalsDisplay', () => {
  it('should render 3 active signals with icons', () => {
    const signals = [
      createSignal({ id: '1', type: 'expansion', active: true }),
      createSignal({ id: '2', type: 'tender', active: true }),
      createSignal({ id: '3', type: 'news', active: true }),
    ]

    const { container } = render(<SignalsDisplay signals={signals} />)
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(3)
  })

  it('should not render inactive signals', () => {
    const signals = [
      createSignal({ id: '1', active: true }),
      createSignal({ id: '2', active: false }),
    ]

    const { container } = render(<SignalsDisplay signals={signals} />)
    const icons = container.querySelectorAll('svg')
    expect(icons).toHaveLength(1)
  })

  it('should show "Sin señales" when no active signals', () => {
    render(<SignalsDisplay signals={[createSignal({ active: false })]} />)
    expect(screen.getByText('Sin señales')).toBeInTheDocument()
  })

  it('should show "Sin señales" when signals array is empty', () => {
    render(<SignalsDisplay signals={[]} />)
    expect(screen.getByText('Sin señales')).toBeInTheDocument()
  })
})
