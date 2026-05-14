'use client'

import React from 'react'
import { LeadsFilterBar } from '@/components/leads/LeadsFilterBar'
import { ContactList } from '@/components/leads/ContactList'

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Leads y Decisores
          </h1>
          <p className="text-gray-600">
            Encuentra y gestiona los contactos clave de todas tus empresas objetivo
          </p>
        </div>

        {/* Filters */}
        <LeadsFilterBar />

        {/* Contacts List */}
        <div className="bg-white rounded-lg border p-6">
          <ContactList />
        </div>
      </div>
    </div>
  )
}
