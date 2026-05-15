'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listCompanies } from '@/lib/api/companies'
import { useLeadsFiltersSync } from '@/lib/hooks/useLeadsFiltersSync'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function LeadsFilterBar() {
  const filters = useLeadsFiltersSync()
  const [titleInput, setTitleInput] = useState(filters.titleQuery)
  const debouncedTitle = useDebounce(titleInput, 300)

  // Fetch companies for the select
  const { data: companiesResponse } = useQuery({
    queryKey: ['companies'],
    queryFn: () => listCompanies({ page_size: 100 }),
  })

  // Update filter when debounced title changes
  useEffect(() => {
    filters.setTitleQuery(debouncedTitle)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTitle])

  const hasActiveFilters = filters.companyId || filters.titleQuery || filters.reliability

  return (
    <div className="border rounded-lg p-4 bg-white space-y-4">
      <h3 className="font-semibold text-base">Filtros</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Company Select */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Empresa</label>
          <Select value={filters.companyId || 'all'} onValueChange={(val) => filters.setCompanyId(val === 'all' ? undefined : val)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar empresa..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empresas</SelectItem>
              {companiesResponse?.data.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title Search */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Cargo</label>
          <Input
            placeholder="Buscar por cargo..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
        </div>

        {/* Reliability Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Confiabilidad</label>
          <Select value={filters.reliability || 'all'} onValueChange={(val) => filters.setReliability(val === 'all' ? undefined : val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Media</SelectItem>
              <SelectItem value="low">Baja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Status and Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-2 flex-wrap">
            {filters.companyId && (
              <Badge variant="secondary">
                Empresa seleccionada
              </Badge>
            )}
            {filters.titleQuery && (
              <Badge variant="secondary">
                Cargo: {filters.titleQuery}
              </Badge>
            )}
            {filters.reliability && (
              <Badge variant="secondary">
                {filters.reliability === 'high' && 'Confiabilidad: Alta'}
                {filters.reliability === 'medium' && 'Confiabilidad: Media'}
                {filters.reliability === 'low' && 'Confiabilidad: Baja'}
              </Badge>
            )}
          </div>
          <Button
            onClick={filters.resetFilters}
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar
          </Button>
        </div>
      )}
    </div>
  )
}
