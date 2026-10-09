import { useMemo, useState } from 'react'
import { useT } from '../../hooks/useT'
import { getUsers, setUserStatus } from '../../services/mockDb'
import { getOrders } from '../../services/orders'
import { isSold } from '../../utils/orders'
import { PERIODS, vipMap } from '../../utils/analytics'
import { vnd } from '../../utils/pricing'
import { Icon } from '../AuthLayout'
import { VipBadge } from '../OrderStatus'

const tone = { active: 'bg-emerald-100 text-emerald-800', pending: 'bg-amber-100 text-amber-800', blocked: 'bg-wine-700 text-chalk' }

export default function UsersTab() {
  const { t } = useT()
  const a = t.adm.a
  const [users, setUsers] = useState(getUsers)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const orders = useMemo(() => getOrders(), [])
  const vips = useMemo(() => vipMap(orders), [orders])
  const stats = useMemo(() => {
    const m = {}
    orders.filter(isSold).forEach((o) => { const e = (m[o.userId] ??= { n: 0, sum: 0 }); e.n += 1; e.sum += o.total })
    return m
  }, [orders])

  const count = (s) => users.filter((u) => u.status === s).length
  const list = users
    .filter((u) => (filter === 'all' || u.status === filter) && `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => (x.status === 'pending' ? -1 : 0) - (y.status === 'pending' ? -1 : 0))
  const pills = [['all', t.adm.u.f.all, users.length], ...Object.entries(t.admin.status).map(([k, label]) => [k, label, count(k)])]

  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold">{t.adm.u.title}</h2>
      <div className="relative mt-5">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-navy-900/40" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.admin.search} aria-label={t.admin.search} className="w-full rounded-2xl border border-transparent bg-white py-3 pl-11 pr-4 text-sm shadow-sm ring-1 ring-navy-900/10 outline-none focus:ring-2 focus:ring-wine-700/40" />
      </div>
      <div role="tablist" className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {pills.map(([k, label, n]) => (
          <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === k ? 'bg-navy-900 text-chalk' : 'bg-white ring-1 ring-navy-900/15 hover:ring-wine-700'}`}>
            {label} <span className="ml-1 opacity-60">{n}</span>
          </button>
        ))}
      </div>

      <ul className="mt-5 grid gap-3">
        {list.map((u) => {
          const s = stats[u.id]
          const myVips = (vips[u.id] ?? []).sort((x, y) => PERIODS.indexOf(y.period) - PERIODS.indexOf(x.period))
          return (
            <li key={u.id} className="grid items-center gap-4 rounded-3xl bg-white p-4 shadow-[0_8px_30px_-22px_rgba(11,27,58,.4)] ring-1 ring-navy-900/8 sm:grid-cols-[1fr_auto_auto] sm:px-6">
              <div className="flex min-w-0 items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-wine-700 to-navy-900 text-lg font-bold text-chalk">{u.name.trim().charAt(0).toUpperCase()}</span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 font-semibold">
                    {u.name}
                    {myVips.map((v) => <VipBadge key={v.period + v.seg} label={a.vipOf.replace('{p}', a.unit[v.period]).replace('{s}', a[v.seg].toLowerCase())} />)}
                  </p>
                  <p className="truncate text-sm text-navy-900/65">{u.email}</p>
                  {u.phone && <p className="font-num text-base text-navy-900/65">{u.phone}</p>}
                </div>
              </div>
              <div className="text-sm sm:text-right">
                {s ? <><p className="font-num text-xl text-wine-700">{vnd.format(s.sum)}</p><p className="text-navy-900/55">{s.n} {t.adm.u.orders}</p></> : <p className="text-navy-900/45">{t.adm.u.noOrders}</p>}
              </div>
              <select value={u.status} disabled={u.role === 'admin'} onChange={(e) => setUsers(setUserStatus(u.id, e.target.value))} aria-label={u.name}
                className={`rounded-full px-4 py-2 text-sm font-semibold outline-none disabled:opacity-60 ${tone[u.status]}`}>
                {Object.entries(t.admin.status).map(([k, label]) => <option key={k} value={k} className="bg-white text-navy-900">{label}</option>)}
              </select>
            </li>
          )
        })}
        {!list.length && <li className="rounded-3xl bg-white p-10 text-center text-navy-900/60 ring-1 ring-navy-900/8">{t.admin.none}</li>}
      </ul>
    </div>
  )
}s