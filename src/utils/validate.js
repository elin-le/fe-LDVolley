export const isPhone = (v) => /^(\+?84|0)\d{9,10}$/.test(v.replace(/[\s.-]/g, ''))
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())