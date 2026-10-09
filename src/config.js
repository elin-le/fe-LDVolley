// Replace with your real contact link (Zalo / Messenger / tel:)
export const siteConfig = { contactUrl: 'https://zalo.me/0900000000' }


// Cloudinary (put these in .env, see .env.example)
export const cloudinary = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // must be an UNSIGNED preset
  deleteUrl: import.meta.env.VITE_CLOUDINARY_DELETE_URL, // your backend endpoint that signs + destroys
  folder: 'ldvolley/products',
}