'use client'

import { Contact } from '@/lib/api/types'
import { Mail, Phone, ExternalLink, AlertCircle, UserCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ContactsListProps {
  contacts: Contact[]
  isLoading?: boolean
  isError?: boolean
  is403Error?: boolean
  errorMessage?: string | null
}

export function ContactsList({
  contacts,
  isLoading = false,
  isError = false,
  is403Error = false,
  errorMessage = null
}: ContactsListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Decisores Detectados</h3>
        <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          {contacts.length} Encontrados
        </span>
      </div>

      {is403Error && errorMessage && (
        <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 flex gap-4">
          <AlertCircle className="h-6 w-6 text-warning flex-shrink-0" />
          <div className="space-y-1">
            <p className="font-bold text-sm text-warning-foreground">Permiso limitado (Apollo)</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {isError && !is403Error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-center">
          <p className="text-sm font-medium text-destructive">Error al sincronizar decisores</p>
        </div>
      )}

      {isLoading && (
        <div className="grid gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-secondary/20 p-4 h-24 animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && !isError && contacts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-secondary/10">
          <UserCircle2 className="mx-auto h-8 w-8 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No se encontraron decisores aún</p>
        </div>
      )}

      {!isLoading && !isError && contacts.length > 0 && (
        <div className="grid gap-3">
          {contacts.map(contact => (
            <div 
              key={contact.id} 
              className="group relative overflow-hidden rounded-2xl border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <UserCircle2 className="h-6 w-6" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{contact.name}</p>
                  <p className="text-xs font-medium text-muted-foreground">{contact.title}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-3">
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary">
                          <Mail className="h-3 w-3" />
                        </div>
                        Email
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary">
                          <Phone className="h-3 w-3" />
                        </div>
                        Llamar
                      </a>
                    )}
                    {contact.linkedin_url && (
                      <a
                        href={contact.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors"
                      >
                         <div className="flex h-5 w-5 items-center justify-center rounded-md bg-secondary text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary">
                          <ExternalLink className="h-3 w-3" />
                        </div>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
