import { useState, useMemo } from "react"

interface UsePaginationOptions {
  pageSize?: number
  initialPage?: number
}

export function usePagination<T>(
  items: T[],
  options?: UsePaginationOptions
) {
  const pageSize = options?.pageSize ?? 10
  const [currentPage, setCurrentPage] = useState(options?.initialPage ?? 1)

  const totalPages = Math.ceil(items.length / pageSize)
  const validPage = Math.max(1, Math.min(currentPage, totalPages || 1))

  const paginatedItems = useMemo(() => {
    const startIdx = (validPage - 1) * pageSize
    const endIdx = startIdx + pageSize
    return items.slice(startIdx, endIdx)
  }, [items, validPage, pageSize])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages || 1)))
  }

  const nextPage = () => goToPage(validPage + 1)
  const prevPage = () => goToPage(validPage - 1)

  return {
    paginatedItems,
    currentPage: validPage,
    totalPages,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage: validPage < totalPages,
    hasPrevPage: validPage > 1,
    totalItems: items.length,
  }
}
