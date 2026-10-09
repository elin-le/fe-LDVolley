import { cloudinary as cfg } from '../config'

export const isCloudinaryReady = () => Boolean(cfg.cloudName && cfg.uploadPreset)
export const isCloudinaryUrl = (u) => /^https:\/\/res\.cloudinary\.com\//.test(u ?? '')

// https://res.cloudinary.com/<cloud>/image/upload/[transforms/][v123/]folder/name.jpg -> folder/name
export function publicIdFromUrl(url) {
  const rest = url.split('/upload/')[1]
  if (!rest) return null
  const seg = rest.split('?')[0].split('/')
  const v = seg.findIndex((s) => /^v\d+$/.test(s))
  return decodeURIComponent((v >= 0 ? seg.slice(v + 1) : seg).join('/').replace(/\.[a-z0-9]+$/i, ''))
}

export async function uploadImage(file) {
  if (!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024) throw new Error('badFile')
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', cfg.uploadPreset)
  body.append('folder', cfg.folder)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`, { method: 'POST', body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.secure_url) throw new Error(data.error?.message ?? 'uploadFail')
  return data.secure_url
}

// Deleting needs the API secret, so it goes through your own endpoint (see api/cloudinary-delete.js)
// -> 'deleted' | 'skipped' (not a Cloudinary link) | 'no-endpoint' | 'failed'
export async function deleteImage(url) {
  if (!isCloudinaryUrl(url)) return 'skipped'
  if (!cfg.deleteUrl) return 'no-endpoint'
  try {
    const res = await fetch(cfg.deleteUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ publicId: publicIdFromUrl(url) }) })
    return res.ok ? 'deleted' : 'failed'
  } catch { return 'failed' }
}