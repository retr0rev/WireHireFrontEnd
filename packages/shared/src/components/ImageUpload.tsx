import { useState, useRef } from 'react'
import { apiFetch } from '../api/client'
import { API_PATHS } from '../api/paths'

interface UploadURLResponse {
  upload_url: string
  public_url: string
}

interface ImageUploadProps {
  type: 'logo' | 'banner'
  currentUrl?: string
  onUpload: (url: string) => void
  label: string
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB

export function ImageUpload({ type, currentUrl, onUpload, label }: ImageUploadProps) {
  const [preview, setPreview] = useState(currentUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    // Client-side validation.
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Allowed: PNG, JPEG, WebP, SVG.')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('File too large. Maximum size is 5 MB.')
      return
    }

    // Get the extension from the file name or infer from MIME type.
    const ext = file.name.split('.').pop() ?? file.type.split('/')[1] ?? 'png'

    setUploading(true)
    try {
      // Get presigned URL from backend.
      const res = await apiFetch<UploadURLResponse>(API_PATHS.uploadUrl, {
        method: 'POST',
        body: JSON.stringify({ type, content_type: file.type, ext }),
      })

      // PUT file directly to R2.
      const putRes = await fetch(res.upload_url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      if (!putRes.ok) {
        throw new Error(`Upload failed (HTTP ${putRes.status})`)
      }

      setPreview(res.public_url)
      onUpload(res.public_url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      // Reset input so reselecting the same file triggers onChange.
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {preview && (
        <div className="relative inline-block">
          {type === 'logo' ? (
            <img
              src={preview}
              alt="Preview"
              className="h-16 w-16 rounded-lg object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-full max-w-md rounded-lg object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={fileRef}
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.svg"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
        />
        {uploading && (
          <span className="text-sm text-gray-500">Uploading...</span>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
