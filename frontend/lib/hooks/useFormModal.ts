import { useState, useCallback } from "react"

interface UseFormModalOptions<T> {
  onSubmit?: (data: T) => Promise<void> | void
  onClose?: () => void
}

export function useFormModal<T>(
  initialData?: T,
  options?: UseFormModalOptions<T>
) {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | undefined>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback((initialValue?: T) => {
    setData(initialValue ?? initialData)
    setError(null)
    setIsOpen(true)
  }, [initialData])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(initialData)
    setError(null)
    options?.onClose?.()
  }, [initialData, options])

  const submit = useCallback(
    async (formData: T) => {
      setIsLoading(true)
      setError(null)
      try {
        await options?.onSubmit?.(formData)
        close()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar")
      } finally {
        setIsLoading(false)
      }
    },
    [options, close]
  )

  return {
    isOpen,
    data,
    isLoading,
    error,
    open,
    close,
    submit,
    setData,
  }
}
