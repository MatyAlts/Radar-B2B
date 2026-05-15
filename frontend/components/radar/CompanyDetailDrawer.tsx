'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HelpButton } from '@/components/ui/HelpButton'
import { Company } from '@/lib/api/types'
import { ScoreBadge } from './ScoreBadge'
import { TemperatureBadge } from './TemperatureBadge'
import { SignalBreakdown } from './details/SignalBreakdown'
import { JustificationSection } from './details/JustificationSection'
import { ContactsList } from './details/ContactsList'
import { TendersList } from './details/TendersList'
import { ContactList } from '@/components/leads/ContactList'
import { EnrichAction } from '@/components/leads/EnrichAction'
import { helpContent } from '@/lib/utils/helpContent'

interface CompanyDetailDrawerProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
  onScoreUpdate?: (updatedCompany: Company) => void
}

export function CompanyDetailDrawer({
  company,
  isOpen,
  onClose,
  onScoreUpdate,
}: CompanyDetailDrawerProps) {
  if (!company) return null

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="flex items-start justify-between">
          <div className="flex-1">
            <DrawerTitle>{company.name}</DrawerTitle>
            <DrawerDescription>
              {company.industry} • {company.city}, {company.country}
            </DrawerDescription>
          </div>
          <div className="flex-shrink-0">
            <HelpButton content={helpContent.radar.detalle} title="Detalle de Empresa" />
          </div>
        </DrawerHeader>

        <Tabs defaultValue="resumen" className="overflow-y-auto px-4 pb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="contactos">Contactos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="space-y-6">
            {/* Score Section */}
            <div className="flex gap-3">
              <ScoreBadge score={company.score} />
              <TemperatureBadge temperature={company.temperature} />
            </div>

            {/* Signals Breakdown */}
            <SignalBreakdown signals={company.signals} />

            {/* Justification */}
            <JustificationSection 
              companyId={company.id} 
              justification={company.score_justification} 
              onScoreUpdate={onScoreUpdate}
            />

            {/* Contacts from initial payload */}
            {company.contacts.length > 0 && <ContactsList contacts={company.contacts} />}

            {/* Tenders */}
            {company.tenders.length > 0 && <TendersList tenders={company.tenders} />}
          </TabsContent>

          <TabsContent value="contactos" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base">Decisores de la empresa</h3>
              <EnrichAction company={company} />
            </div>
            <ContactList companyId={company.id} />
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  )
}
