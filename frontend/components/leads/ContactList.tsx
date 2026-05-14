'use client'

import React from 'react'
import { useContacts } from '@/lib/hooks/useContacts'
import { ContactCard } from './ContactCard'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ContactListProps {
  companyId?: string
}

function ContactListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 bg-gray-100 animate-pulse"
        >
          <div className="h-5 bg-gray-300 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-3" />
          <div className="flex gap-2 mb-3">
            <div className="h-6 bg-gray-300 rounded w-16" />
            <div className="h-6 bg-gray-300 rounded w-32" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ContactList({ companyId }: ContactListProps) {
  const { contacts, isLoading, isError, error, refetch } = useContacts(companyId)

  if (isLoading) {
    return (
      <div>
        <h3 className="font-semibold text-lg mb-4">Cargando contactos...</h3>
        <ContactListSkeleton />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Error al cargar contactos</h3>
        </div>
        <p className="text-sm text-red-700 mb-4">
          {error?.message || 'Ocurrió un error inesperado'}
        </p>
        <Button onClick={() => refetch()} size="sm" variant="outline">
          Reintentar
        </Button>
      </div>
    )
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {companyId ? (
          <>
            <p className="text-base mb-2">No hay contactos para esta empresa</p>
            <p className="text-sm">Intenta enriquecer la empresa para buscar nuevos decisores</p>
          </>
        ) : (
          <>
            <p className="text-base mb-2">No hay contactos disponibles</p>
            <p className="text-sm">Selecciona una empresa para ver sus contactos</p>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">
          {contacts.length} {contacts.length === 1 ? 'contacto' : 'contactos'}
        </h3>
      </div>
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  )
}
