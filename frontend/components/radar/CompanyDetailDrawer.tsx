'use client'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Company } from '@/lib/api/types'
import { ScoreBadge } from './ScoreBadge'
import { TemperatureBadge } from './TemperatureBadge'
import { SignalBreakdown } from './details/SignalBreakdown'
import { JustificationSection } from './details/JustificationSection'
import { ContactsList } from './details/ContactsList'
import { TendersList } from './details/TendersList'

interface CompanyDetailDrawerProps {
  company: Company | null
  isOpen: boolean
  onClose: () => void
}

export function CompanyDetailDrawer({
  company,
  isOpen,
  onClose,
}: CompanyDetailDrawerProps) {
  if (!company) return null

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{company.name}</DrawerTitle>
          <DrawerDescription>
            {company.industry} • {company.city}, {company.country}
          </DrawerDescription>
        </DrawerHeader>

        <div className="space-y-6 overflow-y-auto px-4 pb-6">
          {/* Score Section */}
          <div className="flex gap-3">
            <ScoreBadge score={company.score} />
            <TemperatureBadge temperature={company.temperature} />
          </div>

          {/* Signals Breakdown */}
          <SignalBreakdown signals={company.signals} />

          {/* Justification */}
          <JustificationSection justification={company.score_justification} />

          {/* Contacts */}
          {company.contacts.length > 0 && <ContactsList contacts={company.contacts} />}

          {/* Tenders */}
          {company.tenders.length > 0 && <TendersList tenders={company.tenders} />}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
