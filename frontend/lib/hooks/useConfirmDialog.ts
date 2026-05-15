import { useState, useCallback } from "react"

interface ConfirmOptions {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

interface UseConfirmDialogOptions {
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
}

export function useConfirmDialog(options?: UseConfirmDialogOptions) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback((opts?: ConfirmOptions) => {
    setConfirmOptions(opts ?? {})
    setError(null)
    setIsOpen(true)
  }, [])

  const cancel = useCallback(() => {
    setIsOpen(false)
    setError(null)
    options?.onCancel?.()
  }, [options])

  const confirm = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await options?.onConfirm?.()
      setIsOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al confirmar")
    } finally {
      setIsLoading(false)
    }
  }, [options])

  return {
    isOpen,
    isLoading,
    error,
    ...confirmOptions,
    open,
    cancel,
    confirm,
  }
}
