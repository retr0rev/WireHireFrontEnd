import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'
import type { JobApp, Client } from '../types'

export function usePublicJobs() {
  return useQuery({
    queryKey: ['publicJobs'],
    queryFn: () => apiFetch<JobApp[]>(API_PATHS.publicJobs),
  })
}

export function usePublicEmployers() {
  return useQuery({
    queryKey: ['publicEmployers'],
    queryFn: () => apiFetch<Client[]>(API_PATHS.publicEmployers),
  })
}
