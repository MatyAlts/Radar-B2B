'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageContainer } from '@/components/layout/PageContainer'
import { FilterPanel } from '@/components/radar/FilterPanel'
import { CompanyTable } from '@/components/radar/CompanyTable'
import { Pagination } from '@/components/radar/Pagination'
import { CompanyDetailDrawer } from '@/components/radar/CompanyDetailDrawer'
import { useCompanies } from '@/lib/hooks/use-companies'
import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { usePagination } from '@/lib/hooks/usePagination'
import { Company } from '@/lib/api/types'
import { helpContent } from '@/lib/utils/helpContent'

export default function RadarPage() {
  const searchParams = useSearchParams()
  const { data, isLoading, isError, refetch } = useCompanies()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const filters = useRadarFilters()
  const { paginatedItems } = usePagination(data?.data || [], { pageSize: 10 })

  // Sync drawer state with URL param
  useEffect(() => {
    const companyId = searchParams.get('company')
    if (companyId && data?.data) {
      const company = data.data.find(c => c.id === companyId)
      if (company) {
        setSelectedCompany(company)
        setIsDrawerOpen(true)
      }
    } else {
      setIsDrawerOpen(false)
    }
  }, [searchParams, data?.data])

  const handleRowClick = (company: Company) => {
    setSelectedCompany(company)
    setIsDrawerOpen(true)
    window.history.pushState({}, '', `?company=${company.id}`)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    window.history.pushState({}, '', window.location.pathname)
  }

  return (
    <>
      <PageContainer
        title="Radar B2B"
        subtitle="Detecta empresas con alta probabilidad de compra"
        helpContent={helpContent.radar.page}
        className="flex-row gap-0 p-0"
      >
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Filters */}
          <aside className="w-80 border-r border-border bg-background p-4 overflow-y-auto">
            <FilterPanel />
          </aside>

          {/* Main - Table */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {data?.total === 0 ? 'Sin resultados' : `${data?.total || 0} empresas encontradas`}
                </h2>
              </div>

              {/* Table */}
              <CompanyTable
                companies={paginatedItems}
                isLoading={isLoading}
                isError={isError}
                onRefetch={() => refetch()}
                onRowClick={handleRowClick}
              />

              {/* Pagination */}
              {data && (
                <div className="flex justify-center pt-4">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={data.total_pages}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </PageContainer>

      {/* Drawer */}
      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  )
}
