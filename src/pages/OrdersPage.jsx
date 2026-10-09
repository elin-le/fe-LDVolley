import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router'
import { useT } from '../hooks/useT'
import { selectUser } from '../store/authSlice'
import { siteConfig } from '../config'
import { getOrders, getUserOrders, requestCancel } from '../services/orders'
import { fmtDate, isOpen } from '../utils/orders'
import { vipMap } from '../utils/analytics'
import { vnd } from '../utils/pricing'
import { Icon } from '../components/AuthLayout'
import { Stepper, StatusBadge, TypeBadge, VipBadge } from '../components/OrderStatus'

const FILTERS = { all: () => true, active: isOpen, completed: (o) => o.status === 'completed', cancelled: (o) => o.status === 'cancelled' }

function OrderCard({ order: o, open, onToggle, onChange, highlight }) {
  const { t, lang } = useT()
  const m = t.ord.my
  const [asking, setAsking] = useState(false)
  const [reason, setReason] = useState('')
  const req = o.cancelRequest
  const canCancel = o.status === 'pending' && req?.state !== 'requested'
  const units = o.lines.reduce((s, l) => s + l.qty, 0)

  return (
    <li className={`rounded-3xl bg-white shadow-[0_10px_40px_-26px_rgba(11,27,58,.4)] transition ${highlight ? 'ring-2 ring-emerald-500/60' : 'ring-1 ring-navy-900/8'}`}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="grid w-full gap-4 p-5 text-left sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-num text-2xl tracking-wide">{o.id}</p>
            <p className="font-sans text-sm text-navy-900/60">{fmtDate(o.createdAt, lang)} · {units} {m.items}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TypeBadge type={o.type} />
            <StatusBadge status={o.status} />
          </div>
        </div>
        <Stepper status={o.status} />
        <div className="flex items-center justify-between gap-3">
          <div className="flex -space-x-2">
            {o.lines.slice(0, 4).map((l) => (
              <span key={l.id} className="size-10 overflow-hidden rounded-full bg-sand ring-2 ring-white">{l.image && <img src={l.image} alt="" className="size-full object-cover" />}</span>
            ))}
            {o.lines.length > 4 && <span className="grid size-10 place-items-center rounded-full bg-navy-900 font-sans text-xs font-semibold text-chalk ring-2 ring-white">+{o.lines.length - 4}</span>}
          </div>
          <div className="flex items-center gap-3">
            <p className="font-num text-2xl text-wine-700">{vnd.format(o.total)}</p>
            <Icon name="chevron" className={`size-5 text-navy-900/50 transition-transform ${open ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {open && (
        <div className="grid gap-5 border-t border-navy-900/10 p-5 font-sans sm:p-6">
          <ul className="grid gap-3">
            {o.lines.map((l) => (
              <li key={l.id} className="flex items-center gap-3">
                <span className="size-14 shrink-0 overflow-hidden rounded-2xl bg-sand">{l.image && <img src={l.image} alt="" className="size-full object-cover" />}</span>
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${l.id}`} className="line-clamp-1 text-sm font-semibold hover:text-wine-700">{l.name[lang]}</Link>
                  <p className="text-sm text-navy-900/65">
                    {vnd.format(l.price)} × {l.qty}
                    {l.isWholesale && <span className="ml-2 rounded-full bg-navy-900 px-2 py-0.5 text-[11px] font-semibold text-chalk">{t.ord.co.wsApplied}</span>}
                  </p>
                </div>
                <p className="font-num text-lg">{vnd.format(l.price * l.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="grid gap-4 rounded-2xl bg-navy-900/[0.035] p-4 text-sm sm:grid-cols-2">
            <div>
              <p className="font-semibold">{m.shipTo}</p>
              <p className="mt-1 text-navy-900/75">{o.shipping.name} · {o.shipping.phone}</p>
              <p className="text-navy-900/75">{o.shipping.address}</p>
            </div>
            <div>
              <p className="font-semibold">{m.payment}</p>
              <p className="mt-1 text-navy-900/75">{t.ord.pay[o.payment]}</p>
              {o.note && <p className="mt-2 text-navy-900/75"><span className="font-semibold">{m.note}:</span> {o.note}</p>}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-navy-900/65">{m.total}</p>
              {o.savings > 0 && <p className="text-xs font-semibold text-emerald-700">{m.saved}: {vnd.format(o.savings)}</p>}
            </div>
            <p className="font-num text-3xl text-wine-700">{vnd.format(o.total)}</p>
          </div>

          {req?.state === 'requested' && o.status === 'pending' && <p className="flex gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900"><Icon name="clock" className="mt-0.5 size-4 shrink-0" />{m.cancelSent}</p>}
          {req?.state === 'rejected' && o.status !== 'cancelled' && <p className="rounded-2xl bg-sand px-4 py-3 text-sm">{m.cancelRejected}</p>}

          <div className="flex flex-wrap items-center gap-3">
            {canCancel && !asking && <button type="button" onClick={() => setAsking(true)} className="rounded-2xl px-5 py-2.5 text-sm font-semibold text-wine-700 ring-1 ring-wine-700/40 transition hover:bg-wine-700 hover:text-chalk">{m.cancelReq}</button>}
            <a href={siteConfig.contactUrl} target="_blank" rel="noopener noreferrer" className="rounded-2xl px-5 py-2.5 text-sm font-semibold ring-1 ring-navy-900/20 transition hover:bg-navy-900 hover:text-chalk">{m.contact}</a>
            {o.status !== 'pending' && o.status !== 'cancelled' && o.status !== 'completed' && <p className="text-xs text-navy-900/55">{m.cancelHint}</p>}
          </div>

          {asking && (
            <div className="grid gap-3 rounded-2xl bg-wine-700/[0.05] p-4">
              <label className="grid gap-1.5 text-[13px] font-semibold">
                {m.cancelWhy}
                <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className="rounded-2xl border border-transparent bg-white px-4 py-3 text-[15px] font-normal outline-none focus:border-wine-700/40 focus:ring-4 focus:ring-wine-700/10" />
              </label>
              <div className="flex gap-3">
                <button type="button" onClick={() => { onChange(requestCancel(o.id, reason.trim())); setAsking(false) }} className="rounded-2xl bg-wine-700 px-5 py-2.5 text-sm font-semibold text-chalk transition hover:bg-navy-900">{m.cancelSend}</button>
                <button type="button" onClick={() => setAsking(false)} className="rounded-2xl px-5 py-2.5 text-sm font-semibold ring-1 ring-navy-900/20">{m.cancelKeep}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </li>
  )
}

function Orders({ user }) {
  const { t } = useT()
  const m = t.ord.my
  const [params] = useSearchParams()
  const newId = params.get('new')
  const [orders, setOrders] = useState(() => getUserOrders(user.id))
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(newId)
  const [vip] = useState(() => vipMap(getOrders())[user.id])
  const list = orders.filter(FILTERS[filter])
  const justPlaced = newId && orders.some((o) => o.id === newId)

  return (
    <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="animate-rise text-4xl font-extrabold sm:text-5xl">{m.title}</h1>
        {vip && <VipBadge label={m.vip} />}
      </div>
      <p className="mt-2 font-sans text-navy-900/65">{m.sub}</p>

      {justPlaced && (
        <p role="status" className="animate-rise mt-6 flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 font-sans text-sm font-semibold text-emerald-800">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white"><Icon name="check" className="size-4" /></span>
          {m.newOk}
        </p>
      )}

      <div role="tablist" className="mt-6 flex flex-wrap gap-2 font-sans">
        {Object.keys(FILTERS).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === k ? 'bg-navy-900 text-chalk' : 'bg-white ring-1 ring-navy-900/15 hover:ring-wine-700'}`}>
            {m.f[k]} <span className="ml-1 opacity-60">{orders.filter(FILTERS[k]).length}</span>
          </button>
        ))}
      </div>

      {list.length ? (
        <ul className="mt-6 grid gap-4">
          {list.map((o) => (
            <OrderCard key={o.id} order={o} open={openId === o.id} highlight={o.id === newId}
              onToggle={() => setOpenId(openId === o.id ? null : o.id)} onChange={() => setOrders(getUserOrders(user.id))} />
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-3xl bg-white p-10 text-center ring-1 ring-navy-900/8">
          <p className="text-2xl font-semibold">{orders.length ? m.noneFilter : m.none}</p>
          {!orders.length && <Link to="/products" className="mt-5 inline-block rounded-2xl bg-wine-700 px-7 py-3 font-sans font-semibold text-chalk transition hover:bg-navy-900">{t.cart.shop}</Link>}
        </div>
      )}
    </section>
  )
}

export default function OrdersPage() {
  const user = useSelector(selectUser)
  const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />
  return <Orders user={user} />
}