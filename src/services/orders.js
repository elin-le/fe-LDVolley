import { buildLines, sumLines } from '../utils/pricing'
import { STATUS_FLOW } from '../utils/orders'

const KEY = 'ldv-orders'
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) ?? [] } catch { return [] } }
const write = (o) => localStorage.setItem(KEY, JSON.stringify(o))
const sorted = (os) => [...os].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
const nowIso = () => new Date().toISOString()

export const getOrders = () => sorted(read())
export const getUserOrders = (userId) => getOrders().filter((o) => o.userId === userId)

const newId = () => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `LDV${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`
}

// A new order always starts as "pending": the store contacts the customer before confirming
export function createOrder({ user, lines, shipping, payment, note }) {
  const at = nowIso()
  const order = {
    id: newId(), userId: user.id,
    customer: { name: shipping.name, email: shipping.email || user.email, phone: shipping.phone },
    shipping, payment, note, lines,
    total: sumLines(lines),
    savings: lines.reduce((s, l) => s + (l.retail - l.price) * l.qty, 0),
    type: lines.some((l) => l.isWholesale) ? 'wholesale' : 'retail',
    status: 'pending', cancelRequest: null, adminNote: '', createdAt: at,
    history: [{ event: 'created', status: 'pending', at, by: 'customer' }],
  }
  write([order, ...read()])
  return order
}

const patch = (id, fn) => { const next = read().map((o) => (o.id === id ? fn(o) : o)); write(next); return sorted(next) }

export const setOrderStatus = (id, status, note = '') =>
  patch(id, (o) => ({
    ...o, status,
    cancelRequest: o.cancelRequest?.state === 'requested' && status !== 'cancelled' ? { ...o.cancelRequest, state: 'rejected' } : o.cancelRequest,
    history: [...o.history, { event: 'status', status, at: nowIso(), by: 'admin', note }],
  }))

export const saveAdminNote = (id, adminNote) => patch(id, (o) => ({ ...o, adminNote }))

// Customer can only ask to cancel while the order is still pending
export const requestCancel = (id, reason = '') =>
  patch(id, (o) => (o.status !== 'pending' || o.cancelRequest?.state === 'requested' ? o : {
    ...o, cancelRequest: { reason, at: nowIso(), state: 'requested' },
    history: [...o.history, { event: 'cancel_requested', at: nowIso(), by: 'customer', note: reason }],
  }))

export const resolveCancel = (id, approve) =>
  approve
    ? setOrderStatus(id, 'cancelled', 'cancel_approved')
    : patch(id, (o) => ({ ...o, cancelRequest: { ...o.cancelRequest, state: 'rejected' }, history: [...o.history, { event: 'cancel_rejected', at: nowIso(), by: 'admin' }] }))

/* ---------- demo data (so the analytics page has something to draw) ---------- */
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const CUSTOMERS = [
  { id: 'demo-w1', name: 'CLB Bóng chuyền Thủ Đức', ws: true, w: 3.4 },
  { id: 'demo-w2', name: 'Shop Thể thao Minh Phát', ws: true, w: 2.6 },
  { id: 'demo-w3', name: 'Trường THPT Lê Quý Đôn', ws: true, w: 1.5 },
  { id: 'demo-w4', name: 'Công ty Sao Việt Sports', ws: true, w: 1.1 },
  { id: 'demo-r1', name: 'Nguyễn Hoàng Nam', w: 2.2 }, { id: 'demo-r2', name: 'Trần Thu Hà', w: 1.8 },
  { id: 'demo-r3', name: 'Lê Quốc Bảo', w: 1.4 }, { id: 'demo-r4', name: 'Phạm Ngọc Anh', w: 1.2 },
  { id: 'demo-r5', name: 'Võ Minh Tuấn', w: 1 }, { id: 'demo-r6', name: 'Đặng Thảo Vy', w: 0.8 },
  { id: 'demo-r7', name: 'Bùi Khánh Linh', w: 0.7 }, { id: 'demo-r8', name: 'Huỳnh Gia Hân', w: 0.5 },
]

export function seedDemo(products) {
  const rnd = mulberry32(20261008)
  const now = Date.now()
  const totalW = CUSTOMERS.reduce((s, c) => s + c.w, 0)
  const pickCustomer = () => { let r = rnd() * totalW; for (const c of CUSTOMERS) if ((r -= c.w) <= 0) return c; return CUSTOMERS[0] }

  const orders = Array.from({ length: 170 }, (_, i) => {
    const c = pickCustomer()
    const age = Math.floor(Math.pow(rnd(), 1.5) * 390)
    const created = now - age * 864e5 - rnd() * 864e5
    const picked = [...products].sort(() => rnd() - 0.5).slice(0, c.ws ? 2 + Math.floor(rnd() * 3) : 1 + Math.floor(rnd() * 2))
    const lines = buildLines(picked.map((p) => ({ p, qty: c.ws ? 10 + Math.floor(rnd() * 30) : 1 + Math.floor(rnd() * 3) })), c.ws)
    const x = rnd()
    let status = 'completed'
    if (age < 2) status = x < 0.5 ? 'pending' : x < 0.8 ? 'confirmed' : 'shipping'
    else if (age < 6) status = x < 0.15 ? 'confirmed' : x < 0.5 ? 'shipping' : x < 0.93 ? 'completed' : 'cancelled'
    else if (x < 0.07) status = 'cancelled'

    const at = (h) => new Date(Math.min(now, created + h * 36e5)).toISOString()
    const history = [{ event: 'created', status: 'pending', at: at(0), by: 'customer' }]
    if (status === 'cancelled') history.push({ event: 'status', status: 'cancelled', at: at(8), by: 'admin', note: 'cancel_approved' })
    else STATUS_FLOW.slice(1, STATUS_FLOW.indexOf(status) + 1).forEach((s, k) => history.push({ event: 'status', status: s, at: at(6 + k * 20), by: 'admin' }))

    const phone = `09${String(10000000 + Math.floor(rnd() * 89999999))}`
    return {
      id: `LDV-DEMO-${String(i + 1).padStart(3, '0')}`, userId: c.id, demo: true,
      customer: { name: c.name, email: `${c.id}@demo.ldvolley`, phone },
      shipping: { name: c.name, phone, email: `${c.id}@demo.ldvolley`, address: 'Quận 1, TP. Hồ Chí Minh' },
      payment: rnd() < 0.5 ? 'cod' : 'bank', note: '', lines, total: sumLines(lines),
      savings: lines.reduce((s, l) => s + (l.retail - l.price) * l.qty, 0),
      type: lines.some((l) => l.isWholesale) ? 'wholesale' : 'retail',
      status, cancelRequest: null, adminNote: '', createdAt: new Date(created).toISOString(), history,
    }
  })
  write([...read().filter((o) => !o.demo), ...orders])
  return getOrders()
}
export const clearDemo = () => { write(read().filter((o) => !o.demo)); return getOrders() }