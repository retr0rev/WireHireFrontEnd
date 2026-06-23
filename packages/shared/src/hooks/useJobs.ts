import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'
import type { JobApp, CreateJobRequest, UpdateJobRequest } from '../types'

export function useMyJobs() {
  return useQuery({
    queryKey: ['myJobs'],
    queryFn: () => apiFetch<JobApp[]>(API_PATHS.jobs),
    refetchOnMount: 'always',
  })
}

export function useMyJob(id: number) {
  return useQuery({
    queryKey: ['myJobs', id],
    queryFn: () => apiFetch<JobApp>(API_PATHS.job(id)),
    enabled: !!id,
  })
}

export function useCreateJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateJobRequest) =>
      apiFetch<JobApp>(API_PATHS.jobs, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myJobs'], refetchType: 'active' })
    },
  })
}

export function useUpdateJob(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateJobRequest) =>
      apiFetch<JobApp>(API_PATHS.job(id), {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myJobs'] })
    },
  })
}

export function useDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(API_PATHS.job(id), { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['myJobs'] })
    },
  })
}
