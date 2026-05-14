'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FilterPanel } from '@/components/radar/FilterPanel'
import { CompanyTable } from '@/components/radar/CompanyTable'
import { Pagination } from '@/components/radar/Pagination'
import { CompanyDetailDrawer } from '@/components/radar/CompanyDetailDrawer'
import { useCompanies } from '@/lib/hooks/use-companies'
import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { Company } from '@/lib/api/types'

export default function RadarPage() {
  const searchParams = useSearchParams()
  const { data, isLoading, isError, refetch } = useCompanies()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const filters = useRadarFilters()

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
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Radar B2B</h1>
        <p className="text-sm text-gray-600">Detecta empresas con alta probabilidad de compra</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Filters */}
        <aside className="w-80 border-r border-gray-200 bg-white p-4 overflow-y-auto">
          <FilterPanel />
        </aside>

        {/* Main - Table */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {data?.total === 0 ? 'Sin resultados' : `${data?.total || 0} empresas encontradas`}
              </h2>
            </div>

            {/* Table */}
            <CompanyTable
              companies={data?.data || []}
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

      {/* Drawer */}
      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  )
}
