'use client'

import React from 'react'
import { Contact } from '@/lib/api/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mail, ExternalLink, Phone, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

const TITLE_LEVELS = {
  'C-Level': ['Gerente General', 'Presidente', 'Director', 'CEO', 'COO'],
  'Manager': ['Gerente', 'Jefe', 'Supervisor', 'Coordinador'],
}

function getTitleLevel(title: string): 'C-Level' | 'Manager' | 'Other' {
  const lowerTitle = title.toLowerCase()
  for (const [level, titles] of Object.entries(TITLE_LEVELS)) {
    if (titles.some(t => lowerTitle.includes(t.toLowerCase()))) {
      return level as 'C-Level' | 'Manager'
    }
  }
  return 'Other'
}

function getTitleBadgeColor(level: 'C-Level' | 'Manager' | 'Other') {
  switch (level) {
    case 'C-Level':
      return 'bg-blue-100 text-blue-800'
    case 'Manager':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getReliabilityBadgeColor(reliability: string) {
  switch (reliability) {
    case 'high':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export interface ContactCardProps {
  contact: Contact
}

export function ContactCard({ contact }: ContactCardProps) {
  const [copied, setCopied] = useState(false)
  const titleLevel = getTitleLevel(contact.title)

  const handleCopyEmail = async () => {
    if (!contact.email) return

    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      toast.success('Email copiado')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea')
        textarea.value = contact.email
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopied(true)
        toast.success('Email copiado')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        toast.error(`No se pudo copiar: ${contact.email}`)
      }
    }
  }

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-base">{contact.name}</h3>
          <p className="text-sm text-gray-600">{contact.title}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge className={getTitleBadgeColor(titleLevel)}>
          {titleLevel}
        </Badge>
        <Badge className={getReliabilityBadgeColor(contact.reliability)}>
          Confiabilidad: {contact.reliability}
        </Badge>
      </div>

      <div className="space-y-2">
        {contact.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <button
              onClick={handleCopyEmail}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              {contact.email}
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700">{contact.phone}</span>
          </div>
        )}

        {contact.linkedin_url && (
          <div className="flex items-center gap-2">
            <a
              href={contact.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-3 pt-3 border-t">
        Actualizado: {new Date(contact.last_updated_at).toLocaleDateString('es-BO')}
      </div>
    </div>
  )
}
