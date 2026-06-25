// In production, VITE_API_URL points to the backend origin (set by Vercel).
// In development, it's unset, so requests go to the same origin and are
// proxied by Vite (vite.config.ts server.proxy) to localhost:8080.
const BASE_URL =
  window.ENV?.VITE_API_URL ??
  import.meta.env.VITE_API_URL ??
  ''

/** Read a cookie value by name (same-origin only). */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : undefined
}

// Import CSRF getter from auth module (avoids circular deps via lazy import)
let getCSRFTokenFn: (() => string | null) | null = null

async function getCSRFToken(): Promise<string | null> {
  if (getCSRFTokenFn) return getCSRFTokenFn()
  try {
    const mod = await import('../auth/unified')
    getCSRFTokenFn = mod.getCSRFToken
    return getCSRFTokenFn()
  } catch {
    return null
  }
}

/**
 * Lightweight fetch wrapper that:
 * - Prepends the API base URL
 * - Sends cookies (httpOnly JWT) via credentials: 'include'
 * - Lets the backend set/clear the cookie on login/logout
 * - Adds X-CSRF-Token header on state-changing methods for CSRF protection
 * - Throws on non-2xx with parsed error body
 * - Allows overriding Content-Type for form/multipart
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }

  // Default JSON — let fetch set Content-Type automatically for body-less requests
  if (!headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json'
  }

  // CSRF: add X-CSRF-Token for state-changing methods.
  const method = (options.method ?? 'GET').toUpperCase()
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = await getCSRFToken()
    if (csrfToken) {
      headers['X-CSRF-Token'] = csrfToken
    }
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (res.status === 204) {
    return undefined as T
  }

  const text = await res.text()
  let data: T
  try {
    data = JSON.parse(text)
  } catch {
    throw new ApiFetchError(res.status, text || res.statusText)
  }

  if (!res.ok) {
    const body = data as Record<string, unknown>
    const errMsg =
      typeof body?.error === 'string'
        ? body.error
        : `HTTP ${res.status}`
    throw new ApiFetchError(res.status, errMsg, data)
  }

  return data
}

export class ApiFetchError extends Error {
  status: number
  body?: unknown

  constructor(status: number, message: string, body?: unknown) {
    super(message)
    this.name = 'ApiFetchError'
    this.status = status
    this.body = body
  }
}

// Augment window for SSR-safe env vars
declare global {
  interface Window {
    ENV?: { VITE_API_URL?: string }
  }
}
