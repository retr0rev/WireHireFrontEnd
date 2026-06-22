import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'
import type {
  SignupRequest,
  MessageResponse,
  AuthResponse,
} from '../types'

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) =>
      apiFetch<MessageResponse>(API_PATHS.authSignup, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      apiFetch<AuthResponse>(API_PATHS.authLogin, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      apiFetch<MessageResponse>(API_PATHS.authForgotPassword, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; new_password: string }) =>
      apiFetch<MessageResponse>(API_PATHS.authResetPassword, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}
