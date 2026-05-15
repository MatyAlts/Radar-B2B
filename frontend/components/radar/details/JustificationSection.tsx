'use client'

import { useState } from 'react'
import { Sparkles, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { recalculateCompanyScore } from '@/lib/api/companies'
import { cn } from '@/lib/utils'

interface JustificationSectionProps {
  companyId: string
  justification: string | null
  onScoreUpdate?: (updatedCompany: import('@/lib/api/types').Company) => void
}

export function JustificationSection({ companyId, justification, onScoreUpdate }: JustificationSectionProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true)
      setError(null)
      const updated = await recalculateCompanyScore(companyId)
      onScoreUpdate?.(updated)
    } catch (err) {
      setError('Error al calcular el scoring. Intenta nuevamente.')
      console.error('Score calculation error:', err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Justificación de IA</h3>
      </div>

      <div className={cn(
        "relative overflow-hidden rounded-2xl border p-6 transition-all",
        justification ? "bg-card shadow-sm" : "bg-primary/5 border-primary/20"
      )}>
        {justification === null ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <RefreshCw className={cn("h-6 w-6", isAnalyzing && "animate-spin")} />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-foreground">Análisis de IA Pendiente</p>
              <p className="text-sm text-muted-foreground">
                Nuestros algoritmos están listos para analizar las señales de esta empresa y generar un score detallado.
              </p>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-xs font-medium text-destructive">
                <AlertCircle className="h-3 w-3" />
                {error}
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-2 w-full sm:w-auto"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Calculando Score...
                </>
              ) : (
                'Iniciar Análisis de IA'
              )}
            </Button>
          </div>
        ) : (
          <div className="relative">
            <p className="text-sm leading-relaxed text-foreground/90 first-letter:text-4xl first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:text-primary">
              {justification}
            </p>
            <div className="mt-6 flex justify-end">
               <Button 
                onClick={handleAnalyze} 
                variant="ghost" 
                size="sm" 
                disabled={isAnalyzing}
                className="text-xs text-muted-foreground hover:text-primary"
               >
                 <RefreshCw className={cn("mr-2 h-3 w-3", isAnalyzing && "animate-spin")} />
                 Recalcular Análisis
               </Button>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-[2px]">
             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg animate-bounce">
                <Sparkles className="h-5 w-5" />
             </div>
             <p className="mt-4 text-sm font-black tracking-tighter text-primary animate-pulse">
                PROCESANDO SEÑALES...
             </p>
          </div>
        )}
      </div>
    </div>
  )
}
