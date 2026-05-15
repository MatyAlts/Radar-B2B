'use client'

import React, { Suspense } from 'react'
import { LeadsFilterBar } from '@/components/leads/LeadsFilterBar'
import { ContactList } from '@/components/leads/ContactList'
import { PageContainer } from '@/components/layout/PageContainer'

function LeadsContent() {
  return (
    <PageContainer
      title="Leads y Decisores"
      subtitle="Encontrá y gestioná los contactos clave de todas tus empresas objetivo."
      className="h-full overflow-hidden"
    >
      <div className="flex h-full flex-col gap-6 overflow-hidden px-6 md:px-8 lg:px-10 pb-6">
        <div className="flex-none">
          <LeadsFilterBar />
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ContactList />
        </div>
      </div>
    </PageContainer>
  )
}

export default function LeadsPage() {
  return (
    <Suspense>
      <LeadsContent />
    </Suspense>
  )
}
