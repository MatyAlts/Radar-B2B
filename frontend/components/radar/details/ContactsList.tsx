'use client'

import { Contact } from '@/lib/api/types'
import { Mail, Phone, Linkedin } from 'lucide-react'

interface ContactsListProps {
  contacts: Contact[]
}

export function ContactsList({ contacts }: ContactsListProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Decisores</h3>
      <div className="space-y-2">
        {contacts.map(contact => (
          <div key={contact.id} className="rounded-lg bg-gray-50 p-3">
            <p className="font-medium text-sm text-gray-900">{contact.name}</p>
            <p className="text-xs text-gray-500">{contact.title}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Mail className="h-3 w-3" />
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Phone className="h-3 w-3" />
                  {contact.phone}
                </a>
              )}
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  <Linkedin className="h-3 w-3" />
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
