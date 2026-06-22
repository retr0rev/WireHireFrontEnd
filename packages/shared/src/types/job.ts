export type JobStatus = 'pending' | 'approved' | 'rejected'

export interface JobApp {
  id: number
  client_id: number
  job_title: string
  description: string
  status: JobStatus
  category: string
  location: string
  client_email: string
  phone_number: string | null
  company_name: string
  company_website: string
  company_logo_url: string
  company_bio: string
}

export interface CreateJobRequest {
  job_title: string
  description: string
  category: string
  location: string
}

export interface UpdateJobRequest {
  job_title?: string
  description?: string
  category?: string
  location?: string
}

export interface UpdateJobStatusRequest {
  status: 'approved' | 'rejected'
}
