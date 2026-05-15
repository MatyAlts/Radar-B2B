'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Company } from '@/lib/api/types'
import { ScoreBadge } from './ScoreBadge'
import { TemperatureBadge } from './TemperatureBadge'
import { SignalsDisplay } from './SignalsDisplay'
import { useRadarFilters } from '@/lib/hooks/use-radar-filters'

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

  const SortIcon = ({ column }: { column: 'name' | 'score' | 'industry' }) => {
    if (filters.orderBy !== column) {
      return <ArrowUpDown className="h-4 w-4 opacity-40" />
    }
    return <ArrowUpDown className={`h-4 w-4 ${filters.order === 'asc' ? 'rotate-180' : ''}`} />
  }

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Ciudad</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead>Temperatura</TableHead>
            <TableHead>Señales</TableHead>
            <TableHead>Última actualización</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-error bg-error/10 p-8 text-center">
        <p className="mb-4 text-error">Error al cargar las empresas</p>
        <Button onClick={onRefetch} variant="outline">
          Reintentar
        </Button>
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-input p-8 text-center">
        <p className="text-muted-foreground">No hay empresas que coincidan con los filtros</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
            <div className="flex items-center gap-2">
              Empresa
              <SortIcon column="name" />
            </div>
          </TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Ciudad</TableHead>
          <TableHead className="cursor-pointer text-right" onClick={() => handleSort('score')}>
            <div className="flex items-center justify-end gap-2">
              Score
              <SortIcon column="score" />
            </div>
          </TableHead>
          <TableHead>Temperatura</TableHead>
          <TableHead>Señales</TableHead>
          <TableHead>Última actualización</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map(company => (
          <TableRow
            key={company.id}
            onClick={() => onRowClick?.(company)}
            className="cursor-pointer"
          >
            <TableCell className="font-medium">{company.name}</TableCell>
            <TableCell className="capitalize">{company.industry}</TableCell>
            <TableCell>{company.city}</TableCell>
            <TableCell className="text-right">
              <ScoreBadge score={company.score} />
            </TableCell>
            <TableCell>
              <TemperatureBadge temperature={company.temperature} />
            </TableCell>
            <TableCell>
              <SignalsDisplay signals={company.signals.signals} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {new Date(company.last_updated).toLocaleDateString('es-ES')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
