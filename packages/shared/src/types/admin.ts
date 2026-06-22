export type AdminRole = 'super_admin' | 'moderator'

export interface Admin {
  id: number
  email: string
  admin_role: AdminRole
}

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  token: string
  email: string
  admin_role: AdminRole
}

export interface CreateAdminRequest {
  email: string
  password: string
  role: AdminRole
}
