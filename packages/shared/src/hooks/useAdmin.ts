import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'
import type {
  JobApp,
  UpdateJobStatusRequest,
  Client,
  Admin,
  CreateEmployerRequest,
  CreateAdminRequest,
  UpdateEmployerRequest,
  EmployerCreateResponse,
} from '../types'

// ─── Jobs ────────────────────────────────────────────────────────────

export function useAdminJobs() {
  return useQuery({
    queryKey: ['adminJobs'],
    queryFn: () => apiFetch<JobApp[]>(API_PATHS.adminJobs),
    refetchOnMount: 'always',
  })
}

export function useUpdateJobStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'approved' | 'rejected' }) =>
      apiFetch<JobApp>(API_PATHS.adminJobStatus(id), {
        method: 'PUT',
        body: JSON.stringify({ status } satisfies UpdateJobStatusRequest),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminJobs'] })
    },
  })
}

export function useAdminDeleteJob() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(API_PATHS.adminJobDelete(id), { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminJobs'] })
    },
  })
}

// ─── Employers ───────────────────────────────────────────────────────

export function useAdminEmployers() {
  return useQuery({
    queryKey: ['adminEmployers'],
    queryFn: () => apiFetch<Client[]>(API_PATHS.adminEmployers),
    refetchOnMount: 'always',
  })
}

export function usePendingEmployers() {
  return useQuery({
    queryKey: ['pendingEmployers'],
    queryFn: () => apiFetch<Client[]>(API_PATHS.adminEmployersPending),
    refetchOnMount: 'always',
  })
}

export function useVerifyEmployer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<Client>(API_PATHS.adminEmployerVerify(id), { method: 'PUT' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pendingEmployers'] })
      qc.invalidateQueries({ queryKey: ['adminEmployers'] })
    },
  })
}

export function useCreateEmployer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEmployerRequest) =>
      apiFetch<EmployerCreateResponse>(API_PATHS.adminEmployers, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminEmployers'] })
    },
  })
}

export function useUpdateEmployer(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateEmployerRequest) =>
      apiFetch<Client>(API_PATHS.adminEmployer(id), {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminEmployers'] })
    },
  })
}

export function useDeleteEmployer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<void>(API_PATHS.adminEmployer(id), { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminEmployers'] })
    },
  })
}

// ─── Admins ──────────────────────────────────────────────────────────

export function useAdminList() {
  return useQuery({
    queryKey: ['adminList'],
    queryFn: () => apiFetch<Admin[]>(API_PATHS.adminAdmins),
  })
}

export function useCreateAdmin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAdminRequest) =>
      apiFetch<Admin>(API_PATHS.adminAdmins, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminList'] })
    },
  })
}
