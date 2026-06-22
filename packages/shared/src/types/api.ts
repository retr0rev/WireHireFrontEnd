export interface MessageResponse {
  message: string
}

export interface ApiError {
  error: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}
