'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { enrichCompany } from '@/lib/api/companies'
import { listContacts } from '@/lib/api/contacts'
import { Company } from '@/lib/api/types'
import { Button } from '@/components/ui/button'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface EnrichActionProps {
  company: Company
  onSuccess?: () => void
}

export function EnrichAction({ company, onSuccess }: EnrichActionProps) {
  const [isPolling, setIsPolling] = useState(false)
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contactCountRef = useRef(0)

  // Get initial contact count
  const { data: initialContacts = [] } = useQuery({
    queryKey: ['contacts-enrich', company.id],
    queryFn: () => listContacts(company.id),
  })

  // Mutation for enrichment
  const enrichMutation = useMutation({
    mutationFn: () => enrichCompany(company.id),
    onSuccess: () => {
      contactCountRef.current = initialContacts.length
      setIsPolling(true)
      toast.loading('Buscando decisores... esto puede tomar unos segundos')
      startPolling()
    },
    onError: (error) => {
      toast.error(`Error al buscar decisores: ${error.message}`)
    },
  })

  const startPolling = () => {
    let attempts = 0
    const maxAttempts = 10 // 30s total (10 * 3s)

    const poll = async () => {
      try {
        const contacts = await listContacts(company.id)
        const newCount = contacts.length - contactCountRef.current

        if (newCount > 0) {
          toast.dismiss()
          toast.success(`Se encontraron ${newCount} nuevos decisores`)
          setIsPolling(false)
          onSuccess?.()
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          pollingTimeoutRef.current = setTimeout(poll, 3000)
        } else {
          toast.dismiss()
          toast.info('No se encontraron nuevos decisores en esta búsqueda')
          setIsPolling(false)
        }
      } catch (error) {
        toast.dismiss()
        toast.error('Error al verificar nuevos contactos')
        setIsPolling(false)
      }
    }

    pollingTimeoutRef.current = setTimeout(poll, 3000)
  }

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current)
      }
    }
  }, [])

  // Check if enrichment button should be visible
  const shouldShowButton = () => {
    if (!company.name) return false

    const isApolloEnriched = company.signals?.signals?.some(
      s => s.type === 'expansion' || s.type === 'tender'
    ) || false

    if (!isApolloEnriched) return true

    // Check if last enriched was more than 24h ago
    const lastUpdated = new Date(company.last_updated)
    const now = new Date()
    const hoursSinceUpdate = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)

    return hoursSinceUpdate > 24
  }

  const isDisabled = enrichMutation.isPending || isPolling || !shouldShowButton()
  const showAsSecondary = shouldShowButton() && company.name

  if (!showAsSecondary) {
    return null
  }

  const tooltipText = isPolling
    ? 'Buscando decisores...'
    : enrichMutation.isPending
      ? 'Iniciando búsqueda...'
      : 'Buscar decisores en Apollo'

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => enrichMutation.mutate()}
            disabled={isDisabled}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {enrichMutation.isPending || isPolling ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isPolling ? 'Buscando...' : 'Iniciando...'}
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Buscar decisores
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
