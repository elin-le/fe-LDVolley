export const STATUS_FLOW = ['pending', 'confirmed', 'shipping', 'completed']
export const ALL_STATUS = [...STATUS_FLOW, 'cancelled']
export const NEXT = { pending: 'confirmed', confirmed: 'shipping', shipping: 'completed' }
// Only these count as "sold" in analytics
export const SOLD = ['confirmed', 'shipping', 'completed']
export const isSold = (o) => SOLD.includes(o.status)
export const isOpen = (o) => o.status !== 'completed' && o.status !== 'cancelled'
export const hasCancelRequest = (o) => o.status === 'pending' && o.cancelRequest?.state === 'requested'

export const STATUS_TONE = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-300/70',
  confirmed: 'bg-sky-100 text-sky-800 ring-sky-300/70',
  shipping: 'bg-indigo-100 text-indigo-800 ring-indigo-300/70',
  completed: 'bg-emerald-100 text-emerald-800 ring-emerald-300/70',
  cancelled: 'bg-navy-900/8 text-navy-900/60 ring-navy-900/15',
}

export const fmtDate = (iso, lang, time = true) =>
  new Intl.DateTimeFormat(lang === 'vi' ? 'vi-VN' : 'en-GB', time ? { dateStyle: 'short', timeStyle: 'short' } : { dateStyle: 'medium' }).format(new Date(iso))