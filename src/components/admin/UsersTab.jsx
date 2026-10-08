import { useState } from 'react'
import { useT } from '../../hooks/useT'
import { getUsers, setUserStatus } from '../../services/mockDb'

const tone = { active: 'bg-navy-900 text-chalk', pending: 'bg-sand', blocked: 'bg-wine-700 text-chalk' }

export default function UsersTab() {
  const { t } = useT()
  const [users, setUsers] = useState(getUsers)
  const [q, setQ] = useState('')
  const pending = users.filter((u) => u.status === 'pending').length
  const list = users.filter((u) => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.admin.search} aria-label={t.admin.search} className="min-w-0 flex-1 rounded-full border border-navy-900/25 bg-white px-4 py-2.5 outline-none focus-visible:border-wine-700" />
        <p className="font-num text-xl text-wine-700">{pending} {t.admin.pending}</p>
      </div>
      <ul className="mt-6 grid gap-3">
        {list.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-900/15 bg-white p-4">
            <div className="min-w-0">
              <p className="font-semibold">{u.name}</p>
              <p className="truncate text-sm text-navy-900/70">{u.email}</p>
              {u.phone && <p className="font-num text-base text-navy-900/70">{u.phone}</p>}
            </div>
            <select
              value={u.status}
              disabled={u.role === 'admin'}
              onChange={(e) => setUsers(setUserStatus(u.id, e.target.value))}
              aria-label={u.name}
              className={`rounded-full px-4 py-2 font-semibold outline-none disabled:opacity-60 ${tone[u.status]}`}
            >
              {Object.entries(t.admin.status).map(([k, label]) => <option key={k} value={k} className="bg-white text-navy-900">{label}</option>)}
            </select>
          </li>
        ))}
        {!list.length && <li className="rounded-2xl bg-sand p-6 text-center">{t.admin.none}</li>}
      </ul>
    </div>
  )
}
