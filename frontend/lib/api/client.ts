import { ApiError } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = new URL(endpoint, API_URL).toString()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      data.detail || `HTTP ${response.status}`,
      data
    )
  }

  return response.json()
}
