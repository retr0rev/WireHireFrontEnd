import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock window for BASE_URL before importing apiFetch.
const mockWindow: Record<string, unknown> = { ENV: { VITE_API_URL: 'http://test-api.local' } }
vi.stubGlobal('window', mockWindow)

// Re-import with the mock applied.
const { apiFetch, ApiFetchError } = await import('./client')

describe('apiFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed JSON on 200', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve('{"id":1,"name":"test"}'),
      headers: new Headers(),
    } as Response)

    const result = await apiFetch<{ id: number; name: string }>('/test')
    expect(result).toEqual({ id: 1, name: 'test' })
  })

  it('returns undefined on 204', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 204,
      text: () => Promise.resolve(''),
      headers: new Headers(),
    } as Response)

    const result = await apiFetch<undefined>('/test')
    expect(result).toBeUndefined()
  })

  it('throws ApiFetchError with status and message on 4xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve('{"error":"bad request"}'),
      headers: new Headers(),
    } as Response)

    try {
      await apiFetch('/test')
      expect.fail('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiFetchError)
      expect((e as ApiFetchError).status).toBe(400)
      expect((e as ApiFetchError).message).toBe('bad request')
    }
  })

  it('throws ApiFetchError for non-JSON response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
      headers: new Headers(),
    } as Response)

    try {
      await apiFetch('/test')
      expect.fail('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiFetchError)
      expect((e as ApiFetchError).status).toBe(500)
    }
  })
})
