'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRadarFilters } from '@/lib/hooks/use-radar-filters'

interface PaginationProps {
  currentPage: number
  totalPages: number
  isLoading?: boolean
}

export function Pagination({ currentPage, totalPages, isLoading }: PaginationProps) {
  const filters = useRadarFilters()

  if (totalPages <= 1) {
    return null
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      filters.setPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      filters.setPage(currentPage + 1)
    }
  }

  const pageNumbers = getPaginationNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePreviousPage}
        disabled={currentPage === 1 || isLoading}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`dots-${idx}`} className="px-2 text-gray-500">
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="sm"
            onClick={() => filters.setPage(Number(page))}
            disabled={isLoading}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextPage}
        disabled={currentPage === totalPages || isLoading}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function getPaginationNumbers(current: number, total: number): (number | string)[] {
  const delta = 2
  const range = []
  const rangeWithDots = []
  let l: number

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      range.push(i)
    }
  }

  range.forEach(i => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  return rangeWithDots
}
