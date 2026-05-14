import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScoreBadge } from './ScoreBadge'

describe('ScoreBadge', () => {
  it('should render score value', () => {
    render(<ScoreBadge score={75} />)
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('should have red background for caliente (score >= 70)', () => {
    const { container } = render(<ScoreBadge score={100} />)
    const badge = container.querySelector('[class*="bg-red-100"]')
    expect(badge).toBeInTheDocument()
  })

  it('should have yellow background for tibio (40-69)', () => {
    const { container } = render(<ScoreBadge score={50} />)
    const badge = container.querySelector('[class*="bg-yellow-100"]')
    expect(badge).toBeInTheDocument()
  })

  it('should have gray background for frío (< 40)', () => {
    const { container } = render(<ScoreBadge score={20} />)
    const badge = container.querySelector('[class*="bg-gray-100"]')
    expect(badge).toBeInTheDocument()
  })

  it('should accept custom className', () => {
    const { container } = render(<ScoreBadge score={75} className="custom-class" />)
    const badge = container.querySelector('.custom-class')
    expect(badge).toBeInTheDocument()
  })
})
