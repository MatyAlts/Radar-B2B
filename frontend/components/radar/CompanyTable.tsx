'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Building2, MapPin, Activity, RefreshCw } from 'lucide-react'
import { Company, Industry } from '@/lib/api/types'
import { ScoreBadge } from './ScoreBadge'
import { TemperatureBadge } from './TemperatureBadge'
import { SignalsDisplay } from './SignalsDisplay'
import { useRadarFilters } from '@/lib/hooks/use-radar-filters'
import { cn } from '@/lib/utils'

const INDUSTRY_LABELS: Record<Industry, string> = {
  industria: 'Industria',
  agro: 'Agro',
  mineria: 'Minería',
  'mining & metals': 'Mining & Metals',
  logistica: 'Logística',
  'logistics & supply chain': 'Logistics',
  almacenamiento: 'Almacenamiento',
  warehousing: 'Warehousing',
  chemicals: 'Chemicals',
  farming: 'Farming',
  'mechanical or industrial engineering': 'Engineering',
}

interface CompanyTableProps {
  companies: Company[]
  isLoading: boolean
  isError: boolean
  onRefetch?: () => void
  onRowClick?: (company: Company) => void
}

export function CompanyTable({
  companies,
  isLoading,
  isError,
  onRefetch,
  onRowClick,
}: CompanyTableProps) {
  const filters = useRadarFilters()

  const handleSort = (column: 'name' | 'score' | 'industry') => {
    if (filters.orderBy === column) {
      filters.setOrder(filters.order === 'asc' ? 'desc' : 'asc')
    } else {
      filters.setOrderBy(column)
      filters.setOrder('desc')
    }
  }

  const SortIcon = ({ column }: { column: 'name' | 'score' | 'industry' }) => (
    <ArrowUpDown
      className={cn(
        'h-3 w-3 transition-opacity',
        filters.orderBy === column
          ? 'opacity-100 text-primary'
          : 'opacity-30 group-hover:opacity-70'
      )}
    />
  )

  const colHead = 'text-[11px] font-bold uppercase tracking-widest text-muted-foreground'

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={cn(colHead, 'w-64')}>Empresa</TableHead>
              <TableHead className={colHead}>Sector</TableHead>
              <TableHead className={colHead}>Ubicación</TableHead>
              <TableHead className={cn(colHead, 'text-center')}>Score</TableHead>
              <TableHead className={colHead}>Temperatura</TableHead>
              <TableHead className={colHead}>Señales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="py-3">
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-40 rounded" />
                    <Skeleton className="h-3 w-24 rounded" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16 rounded" /></TableCell>
                <TableCell><Skeleton className="mx-auto h-9 w-9 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24 rounded" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-destructive/20 bg-destructive/5 py-20">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Activity className="h-5 w-5" />
        </div>
        <div className="text-center">
          <p className="font-bold text-destructive">Error al sincronizar el radar</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No se pudo conectar con el servidor
          </p>
        </div>
        <Button onClick={onRefetch} variant="destructive" size="sm" className="gap-2">
          <RefreshCw className="h-3.5 w-3.5" />
          Reintentar
        </Button>
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/5 py-24">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground/30">
          <Building2 className="h-7 w-7" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-foreground">Sin resultados</h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Ajustá los filtros para encontrar más empresas en el radar.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead
              className={cn(colHead, 'group w-64 cursor-pointer hover:text-primary')}
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1.5">
                <Building2 className="h-3 w-3" />
                Empresa
                <SortIcon column="name" />
              </div>
            </TableHead>
            <TableHead
              className={cn(colHead, 'group cursor-pointer hover:text-primary')}
              onClick={() => handleSort('industry')}
            >
              <div className="flex items-center gap-1.5">
                Sector
                <SortIcon column="industry" />
              </div>
            </TableHead>
            <TableHead className={colHead}>Ubicación</TableHead>
            <TableHead
              className={cn(colHead, 'group cursor-pointer text-center hover:text-primary')}
              onClick={() => handleSort('score')}
            >
              <div className="flex items-center justify-center gap-1.5">
                Score
                <SortIcon column="score" />
              </div>
            </TableHead>
            <TableHead className={colHead}>Temperatura</TableHead>
            <TableHead className={colHead}>Señales</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map(company => (
            <TableRow
              key={company.id}
              onClick={() => onRowClick?.(company)}
              className="group cursor-pointer transition-colors hover:bg-secondary/40 active:bg-secondary/60"
            >
              {/* Empresa */}
              <TableCell className="py-3.5">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {company.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {company.city}, {company.country}
                  </span>
                </div>
              </TableCell>

              {/* Sector */}
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-secondary/80 px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  {INDUSTRY_LABELS[company.industry] ?? company.industry}
                </span>
              </TableCell>

              {/* Ubicación — solo ciudad, ya está en empresa */}
              <TableCell>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {company.city}
                </div>
              </TableCell>

              {/* Score */}
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <ScoreBadge score={company.score} />
                </div>
              </TableCell>

              {/* Temperatura */}
              <TableCell>
                <TemperatureBadge temperature={company.temperature} />
              </TableCell>

              {/* Señales */}
              <TableCell>
                <SignalsDisplay signals={company.signals.signals} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
