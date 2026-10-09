import { isSold } from './orders'

export const PERIODS = ['week', 'month', 'quarter', 'year']

const startOf = (kind, d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  if (kind === 'week') x.setDate(x.getDate() - ((x.getDay() + 6) % 7)) // Monday
  else if (kind === 'month') x.setDate(1)
  else if (kind === 'quarter') { x.setDate(1); x.setMonth(Math.floor(x.getMonth() / 3) * 3) }
  else x.setMonth(0, 1)
  return x
}
const shift = (kind, d, n) => {
  const x = new Date(d)
  if (kind === 'week') x.setDate(x.getDate() + 7 * n)
  else if (kind === 'month') x.setMonth(x.getMonth() + n)
  else if (kind === 'quarter') x.setMonth(x.getMonth() + 3 * n)
  else x.setFullYear(x.getFullYear() + n)
  return x
}
export const rangeOf = (kind, offset = 0, now = new Date()) => {
  const start = shift(kind, startOf(kind, now), offset)
  return { start, end: shift(kind, start, 1) }
}
const within = (o, r) => { const t = new Date(o.createdAt); return t >= r.start && t < r.end }
export const soldIn = (orders, r) => orders.filter((o) => isSold(o) && within(o, r))

const sum = (xs, f) => xs.reduce((s, x) => s + f(x), 0)
export const kpis = (os) => {
  const revenue = sum(os, (o) => o.total)
  const ws = os.filter((o) => o.type === 'wholesale')
  return { revenue, count: os.length, aov: os.length ? revenue / os.length : 0, wsShare: os.length ? ws.length / os.length : 0, wsRevenue: sum(ws, (o) => o.total) }
}
export const delta = (cur, prev) => (prev > 0 ? ((cur - prev) / prev) * 100 : null)

const TREND_N = { week: 12, month: 12, quarter: 8, year: 5 }
const label = (kind, d) => {
  const yy = String(d.getFullYear()).slice(2)
  if (kind === 'week') return `${d.getDate()}/${d.getMonth() + 1}`
  if (kind === 'month') return `${d.getMonth() + 1}/${yy}`
  if (kind === 'quarter') return `Q${Math.floor(d.getMonth() / 3) + 1} ${yy}`
  return String(d.getFullYear())
}
export const trend = (orders, kind, now = new Date()) => {
  const n = TREND_N[kind]
  const sold = orders.filter(isSold)
  return Array.from({ length: n }, (_, i) => {
    const r = rangeOf(kind, i - n + 1, now)
    const os = sold.filter((o) => within(o, r))
    const wholesale = os.filter((o) => o.type === 'wholesale').length
    return { label: label(kind, r.start), orders: os.length, wholesale, retail: os.length - wholesale, revenue: sum(os, (o) => o.total) }
  })
}

export const topProducts = (os, limit = 6) => {
  const m = new Map()
  os.forEach((o) => o.lines.forEach((l) => {
    const e = m.get(l.id) ?? { id: l.id, name: l.name, qty: 0, revenue: 0 }
    e.qty += l.qty; e.revenue += l.qty * l.price
    m.set(l.id, e)
  }))
  return [...m.values()].sort((a, b) => b.qty - a.qty).slice(0, limit)
}
export const categoryMix = (os) => {
  const m = new Map()
  os.forEach((o) => o.lines.forEach((l) => m.set(l.category, (m.get(l.category) ?? 0) + l.qty * l.price)))
  return [...m.entries()].map(([id, value]) => ({ id, value })).sort((a, b) => b.value - a.value)
}
export const topCustomers = (os, seg = 'all') => {
  const m = new Map()
  os.filter((o) => seg === 'all' || o.type === seg).forEach((o) => {
    const e = m.get(o.userId) ?? { id: o.userId, name: o.customer.name, orders: 0, revenue: 0, ws: 0 }
    e.orders += 1; e.revenue += o.total; e.ws += o.type === 'wholesale' ? 1 : 0
    m.set(o.userId, e)
  })
  return [...m.values()].sort((a, b) => b.revenue - a.revenue)
}

// VIP = top spender of the current week / month / quarter / year, wholesale and retail ranked separately
export const vipMap = (orders, now = new Date()) => {
  const map = {}
  PERIODS.forEach((period) => {
    const os = soldIn(orders, rangeOf(period, 0, now))
    ;['wholesale', 'retail'].forEach((seg) => {
      const top = topCustomers(os, seg)[0]
      if (top) (map[top.id] ??= []).push({ period, seg })
    })
  })
  return map
}