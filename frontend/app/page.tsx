'use client'

import { useState, useEffect, Suspense } from 'react'
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
import { syncCompanies } from '@/lib/api/companies'

function RadarContent() {
  const searchParams = useSearchParams()
  const { data, isLoading, isError, refetch } = useCompanies()
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [syncState, setSyncState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const filters = useRadarFilters()
  const { paginatedItems } = usePagination(data?.data || [], { pageSize: 20 })

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

  const handleSync = async () => {
    setSyncState('loading')
    try {
      await syncCompanies()
      setSyncState('success')
      refetch()
      setTimeout(() => setSyncState('idle'), 3000)
    } catch {
      setSyncState('error')
      setTimeout(() => setSyncState('idle'), 3000)
    }
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    window.history.pushState({}, '', window.location.pathname)
  }

  return (
    <>
      <PageContainer
        title="Radar de Oportunidades"
        subtitle="Monitoreo de señales de compra en tiempo real."
        helpContent={helpContent.radar.page}
        className="h-full overflow-hidden"
      >
        {/* Two-column layout: sidebar + main */}
        <div className="flex h-full gap-5 overflow-hidden px-6 pb-6 md:px-8 lg:px-10">

          {/* Left sidebar — filters */}
          <FilterPanel />

          {/* Right — table area */}
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">

            {/* Subheader: count + live indicator */}
            <div className="flex flex-none items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                {isLoading
                  ? 'Sincronizando…'
                  : `${data?.total ?? 0} empresa${data?.total !== 1 ? 's' : ''}`}
              </span>
              <button
                onClick={handleSync}
                disabled={syncState === 'loading'}
                className={[
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors',
                  syncState === 'loading' && 'cursor-not-allowed opacity-60 bg-muted text-muted-foreground',
                  syncState === 'success' && 'bg-success/10 text-success',
                  syncState === 'error' && 'bg-destructive/10 text-destructive',
                  syncState === 'idle' && 'bg-primary/10 text-primary hover:bg-primary/20',
                ].filter(Boolean).join(' ')}
              >
                {syncState === 'loading' && (
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
                {syncState === 'success' && '✓'}
                {syncState === 'error' && '✕'}
                {syncState === 'loading' ? 'Sincronizando…' : syncState === 'success' ? 'Listo' : syncState === 'error' ? 'Error' : 'Sincronizar'}
              </button>
            </div>

            {/* Scrollable table */}
            <div className="flex-1 overflow-y-auto">
              <CompanyTable
                companies={paginatedItems}
                isLoading={isLoading}
                isError={isError}
                onRefetch={() => refetch()}
                onRowClick={handleRowClick}
              />
            </div>

            {/* Pagination */}
            {data && data.total_pages > 1 && (
              <div className="flex flex-none justify-center border-t border-border pt-3">
                <Pagination
                  currentPage={filters.page}
                  totalPages={data.total_pages}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </PageContainer>

      <CompanyDetailDrawer
        company={selectedCompany}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        onScoreUpdate={updatedCompany => {
          setSelectedCompany(updatedCompany)
          refetch()
        }}
      />
    </>
  )
}

export default function RadarPage() {
  return (
    <Suspense>
      <RadarContent />
    </Suspense>
  )
}
