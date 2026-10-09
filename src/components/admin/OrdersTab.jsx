import { useMemo, useState } from 'react'
import { useT } from '../../hooks/useT'
import { getOrders, resolveCancel, saveAdminNote, setOrderStatus } from '../../services/orders'
import { ALL_STATUS, NEXT, fmtDate, hasCancelRequest, isOpen } from '../../utils/orders'
import { vipMap } from '../../utils/analytics'
import { vnd } from '../../utils/pricing'
import { Icon } from '../AuthLayout'
import { StatusBadge, Stepper, TypeBadge } from '../OrderStatus'

const btn = 'rounded-2xl px-5 py-2.5 text-sm font-semibold transition active:scale-[.98] disabled:opacity-50'
const link = 'inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-navy-900/20 transition hover:bg-navy-900 hover:text-chalk'

function OrderDetail({ order: o, onChange }) {
  const { t, lang } = useT()
  const m = t.adm.o
  const [note, setNote] = useState(o.adminNote ?? '')
  const [asking, setAsking] = useState(false)
  const next = NEXT[o.status]
  const phone = o.customer.phone.replace(/\D/g, '')
  const reqOpen = hasCancelRequest(o)

  return (
    <div className="grid gap-6 border-t border-navy-900/10 p-4 sm:p-6 lg:grid-cols-[1fr_21rem]">
      <div className="grid content-start gap-5">
        <Stepper status={o.status} />
        <div>
          <p className="mb-2 text-sm font-semibold">{m.items}</p>
          <ul className="grid gap-3">
            {o.lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <span className="size-14 shrink-0 overflow-hidden rounded-2xl bg-sand">{l.image && <img src={l.image} alt="" className="size-full object-cover" />}</span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold">{l.name[lang]}</p>
                  <p className="text-sm text-navy-900/65">
                    {vnd.format(l.price)} × {l.qty}
                    {l.isWholesale && <span className="ml-2 rounded-full bg-navy-900 px-2 py-0.5 text-[11px] font-semibold text-chalk">{t.ord.co.wsApplied}</span>}
                  </p>
                </div>
                <p className="font-num text-lg">{vnd.format(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-baseline justify-between border-t border-navy-900/10 pt-3">
            <div>
              <p className="text-sm font-semibold">{m.total}</p>
              {o.savings > 0 && <p className="text-xs text-navy-900/60">{m.saved}: {vnd.format(o.savings)}</p>}
            </div>
            <p className="font-num text-3xl text-wine-700">{vnd.format(o.total)}</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-2xl bg-navy-900/[0.035] p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="font-semibold">{m.shipTo}</p>
            <p className="mt-1 text-navy-900/75">{o.shipping.name} · {o.shipping.phone}</p>
            <p className="text-navy-900/75">{o.shipping.address}</p>
          </div>
          <div>
            <p className="font-semibold">{m.payment}</p>
            <p className="mt-1 text-navy-900/75">{t.ord.pay[o.payment]}</p>
            {o.note && <p className="mt-2 text-navy-900/75"><span className="font-semibold">{m.custNote}:</span> {o.note}</p>}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">{m.timeline}</p>
          <ol className="grid gap-2 border-l-2 border-navy-900/10 pl-4">
            {o.history.map((h, i) => (
              <li key={i} className="relative text-sm">
                <span className="absolute -left-[1.45rem] top-1.5 size-2.5 rounded-full bg-wine-700 ring-4 ring-white" />
                <span className="font-semibold">{h.event === 'status' ? (h.note === 'cancel_approved' ? t.ord.event.cancel_approved : t.ord.status[h.status]) : t.ord.event[h.event]}</span>
                <span className="text-navy-900/55"> · {t.ord.by[h.by]} · {fmtDate(h.at, lang)}</span>
                {h.event === 'cancel_requested' && h.note && <span className="block text-navy-900/70">“{h.note}”</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="grid content-start gap-4">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-navy-900/10">
          <p className="text-sm font-semibold">{m.contact}</p>
          <p className="mt-1 text-sm text-navy-900/70">{o.customer.name}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`tel:${phone}`} className={link}><Icon name="phone" className="size-4" />{m.call}</a>
            <a href={`https://zalo.me/${phone}`} target="_blank" rel="noopener noreferrer" className={link}>{m.zalo}</a>
            {o.customer.email && <a href={`mailto:${o.customer.email}`} className={link}><Icon name="mail" className="size-4" />{m.mail}</a>}
          </div>
        </div>

        {reqOpen && (
          <div className="rounded-2xl bg-wine-700/[0.07] p-4 ring-1 ring-wine-700/30">
            <p className="flex items-center gap-2 text-sm font-bold text-wine-700"><Icon name="x" className="size-4" />{m.reqTitle}</p>
            <p className="mt-1 text-sm text-navy-900/75">{m.reason}: {o.cancelRequest.reason || m.noReason}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => onChange(resolveCancel(o.id, true))} className={`${btn} bg-wine-700 text-chalk hover:bg-navy-900`}>{m.approve}</button>
              <button type="button" onClick={() => onChange(resolveCancel(o.id, false))} className={`${btn} ring-1 ring-navy-900/25 hover:bg-navy-900 hover:text-chalk`}>{m.reject}</button>
            </div>
          </div>
        )}

        <label className="grid gap-1.5 text-sm font-semibold">
          {m.note}
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={m.notePh} className="rounded-2xl border border-transparent bg-navy-900/[0.04] px-4 py-3 text-sm font-normal outline-none focus:border-wine-700/40 focus:bg-white focus:ring-4 focus:ring-wine-700/10" />
        </label>
        {note !== (o.adminNote ?? '') && <button type="button" onClick={() => onChange(saveAdminNote(o.id, note))} className={`${btn} justify-self-start ring-1 ring-navy-900/25 hover:bg-navy-900 hover:text-chalk`}>{m.noteSave}</button>}

        {next ? (
          <div className="grid gap-2">
            {o.status === 'pending' && <p className="text-xs text-navy-900/60">{m.pendingHint}</p>}
            <button type="button" onClick={() => onChange(setOrderStatus(o.id, next))} className={`${btn} bg-linear-to-r from-wine-700 to-wine-600 py-3 text-chalk shadow-lg shadow-wine-700/25 hover:-translate-y-0.5`}>{m.advance[o.status]}</button>
          </div>
        ) : <p className="text-sm text-navy-900/55">{m.closed}</p>}

        {isOpen(o) && (asking ? (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-sand p-3 text-sm">
            <span className="font-semibold">{m.cancelAsk}</span>
            <button type="button" onClick={() => { onChange(setOrderStatus(o.id, 'cancelled')); setAsking(false) }} className={`${btn} bg-wine-700 py-1.5 text-chalk`}>{m.yes}</button>
            <button type="button" onClick={() => setAsking(false)} className={`${btn} py-1.5 ring-1 ring-navy-900/25`}>{m.no}</button>
          </div>
        ) : <button type="button" onClick={() => setAsking(true)} className="justify-self-start text-sm font-semibold text-wine-700 underline underline-offset-4">{m.cancel}</button>)}
      </div>
    </div>
  )
}

export default function OrdersTab() {
  const { t, lang } = useT()
  const m = t.adm.o
  const [orders, setOrders] = useState(getOrders)
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')
  const [openId, setOpenId] = useState(null)
  const vips = useMemo(() => vipMap(orders), [orders])

  const counts = Object.fromEntries(ALL_STATUS.map((s) => [s, orders.filter((o) => o.status === s).length]))
  const cancelReqs = orders.filter(hasCancelRequest).length
  const list = orders.filter((o) => {
    if (filter === 'cancelReq' ? !hasCancelRequest(o) : filter !== 'all' && o.status !== filter) return false
    return `${o.id} ${o.customer.name} ${o.customer.phone}`.toLowerCase().includes(q.toLowerCase())
  })
  const pills = [['all', m.all, orders.length], ...ALL_STATUS.map((s) => [s, t.ord.status[s], counts[s]]), ['cancelReq', m.cancelReq, cancelReqs]]

  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold">{m.title}</h2>
      <div className="relative mt-5">
        <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-navy-900/40" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={m.search} aria-label={m.search} className="w-full rounded-2xl border border-transparent bg-white py-3 pl-11 pr-4 text-sm shadow-sm ring-1 ring-navy-900/10 outline-none focus:ring-2 focus:ring-wine-700/40" />
      </div>
      <div role="tablist" className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {pills.map(([k, label, n]) => (
          <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${filter === k ? 'bg-navy-900 text-chalk' : 'bg-white ring-1 ring-navy-900/15 hover:ring-wine-700'} ${k === 'cancelReq' && n > 0 && filter !== k ? 'text-wine-700 ring-wine-700/50' : ''}`}>
            {label} <span className="ml-1 opacity-60">{n}</span>
          </button>
        ))}
      </div>

      <ul className="mt-5 grid gap-3">
        {list.map((o) => {
          const open = openId === o.id
          const vip = vips[o.userId]
          return (
            <li key={o.id} className={`overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-22px_rgba(11,27,58,.4)] ring-1 ${hasCancelRequest(o) ? 'ring-wine-700/50' : 'ring-navy-900/8'}`}>
              <button type="button" onClick={() => setOpenId(open ? null : o.id)} aria-expanded={open} className="grid w-full items-center gap-x-4 gap-y-2 p-4 text-left transition hover:bg-navy-900/[0.02] sm:grid-cols-[11rem_1fr_auto_auto_auto] sm:px-6">
                <div>
                  <p className="font-num text-xl tracking-wide">{o.id}</p>
                  <p className="text-xs text-navy-900/55">{fmtDate(o.createdAt, lang)}{o.demo && ` · ${m.demo}`}</p>
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                    {vip && <Icon name="crown" className="size-4 shrink-0 text-amber-500" />}
                    <span className="truncate">{o.customer.name}</span>
                  </p>
                  <p className="font-num text-base text-navy-900/60">{o.customer.phone}</p>
                </div>
                <TypeBadge type={o.type} className="justify-self-start" />
                <p className="font-num text-xl sm:text-right">{vnd.format(o.total)}</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={o.status} />
                    {hasCancelRequest(o) && <span className="rounded-full bg-wine-700 px-2 py-0.5 text-[11px] font-bold text-white">{m.cancelReq}</span>}
                  </div>
                  <Icon name="chevron" className={`size-5 shrink-0 text-navy-900/45 transition-transform ${open ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {open && <OrderDetail order={o} onChange={setOrders} />}
            </li>
          )
        })}
        {!list.length && <li className="rounded-3xl bg-white p-10 text-center text-navy-900/60 ring-1 ring-navy-900/8">{m.none}</li>}
      </ul>
    </div>
  )
}