export interface Client {
  id: number
  email: string
  phone_number: string | null
  verified: number
  company_name: string
  company_website: string
  company_logo_url: string
  company_bio: string
  created_by_admin_id: number | null
  jobs_total: number
  jobs_approved: number
}

export interface SignupRequest {
  email: string
  password: string
  phone?: string
  company_name: string
  company_website?: string
  company_logo_url?: string
  company_bio?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  email: string
  company_name: string
}

export interface EmployerCreateResponse {
  client: Client
  temporary: boolean
}

export interface CreateEmployerRequest {
  email: string
  password: string
  phone?: string
  company_name: string
  company_website?: string
  company_logo_url?: string
  company_bio?: string
}

export interface UpdateEmployerRequest {
  company_name?: string
  company_website?: string
  company_logo_url?: string
  company_bio?: string
  phone?: string
  email?: string
  password?: string
}
