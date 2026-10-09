import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router'
import { useT } from '../hooks/useT'
import { clearCart, setQty } from '../store/cartSlice'
import { selectIsWholesale, selectUser } from '../store/authSlice'
import { createOrder } from '../services/orders'
import { buildLines, sumLines, vnd } from '../utils/pricing'
import { isEmail, isPhone } from '../utils/validate'
import { Area, Field, Icon, submitClass } from '../components/AuthLayout'
import { TypeBadge } from '../components/OrderStatus'

const step = 'grid size-8 place-items-center rounded-full ring-1 ring-navy-900/20 transition hover:bg-navy-900 hover:text-chalk disabled:opacity-40'
const card = 'rounded-3xl bg-white p-5 shadow-[0_10px_40px_-24px_rgba(11,27,58,.35)] ring-1 ring-navy-900/8 sm:p-6'

function Checkout({ user }) {
  const { t, lang } = useT()
  const co = t.ord.co
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const buyId = params.get('buy') // "buy now" mode: order a single product without touching the cart
  const [buyQty, setBuyQty] = useState(Math.max(1, Number(params.get('qty')) || 1))
  const cart = useSelector((s) => s.cart.items)
  const all = useSelector((s) => s.products.items)
  const wholesale = useSelector(selectIsWholesale)

  const [f, setF] = useState({ name: user.name ?? '', phone: user.phone ?? '', email: user.email ?? '', address: '', note: '', payment: 'cod' })
  const [touched, setTouched] = useState({})
  const [busy, setBusy] = useState(false)

  const items = buyId ? { [buyId]: buyQty } : cart
  const rows = Object.entries(items).map(([id, qty]) => ({ p: all.find((x) => x.id === id), qty })).filter((r) => r.p)
  const lines = buildLines(rows, wholesale)
  const total = sumLines(lines)
  const savings = lines.reduce((s, l) => s + (l.retail - l.price) * l.qty, 0)
  const isWs = lines.some((l) => l.isWholesale)
  const setLineQty = (id, q) => (buyId ? setBuyQty(Math.max(1, q)) : dispatch(setQty({ id, qty: q })))

  const valid = { name: f.name.trim().length >= 2, phone: isPhone(f.phone), address: f.address.trim().length >= 8, email: !f.email || isEmail(f.email) }
  const errorOf = (k) => {
    if (!touched[k] || valid[k]) return ''
    if (!f[k].trim()) return t.auth.errors.required
    return k === 'phone' ? t.auth.errors.phoneInvalid : k === 'email' ? t.auth.errors.emailInvalid : k === 'name' ? t.auth.errors.nameInvalid : co.addressPh
  }
  const bind = (k) => ({
    name: k, value: f[k], error: errorOf(k), valid: valid[k] && touched[k] && Boolean(f[k]),
    onChange: (e) => setF((s) => ({ ...s, [k]: e.target.value })),
    onBlur: () => setTouched((s) => ({ ...s, [k]: true })),
  })

  const onSubmit = (e) => {
    e.preventDefault()
    setTouched({ name: true, phone: true, address: true, email: true })
    if (!lines.length || !Object.values(valid).every(Boolean)) return
    setBusy(true)
    const order = createOrder({
      user, lines, payment: f.payment, note: f.note.trim(),
      shipping: { name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), address: f.address.trim() },
    })
    if (!buyId) dispatch(clearCart())
    navigate(`/orders?new=${order.id}`)
  }

  if (!lines.length) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-3xl font-semibold">{co.empty}</p>
        <Link to="/products" className={`${submitClass} mx-auto mt-6 w-fit px-8`}>{co.backShop}</Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
      <Link to={buyId ? `/products/${buyId}` : '/cart'} className="font-sans text-sm text-navy-900/65 underline underline-offset-4 hover:text-wine-700">{buyId ? t.detail.back : co.back}</Link>
      <h1 className="animate-rise mt-3 text-4xl font-extrabold sm:text-5xl">{co.title}</h1>
      <p className="mt-2 font-sans text-navy-900/65">{co.sub}</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_25rem]">
        <div className="grid gap-6">
          <div className={card}>
            <h2 className="text-2xl font-bold">{co.contact}</h2>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={co.name} star icon="user" autoComplete="name" {...bind('name')} />
                <Field label={co.phone} star icon="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0901 234 567" {...bind('phone')} />
              </div>
              <Field label={co.email} icon="mail" type="email" autoComplete="email" {...bind('email')} />
              <Area label={co.address} star placeholder={co.addressPh} autoComplete="street-address" {...bind('address')} />
              <Area label={co.note} placeholder={co.notePh} value={f.note} onChange={(e) => setF((s) => ({ ...s, note: e.target.value }))} />
            </div>
          </div>

          <div className={card}>
            <h2 className="text-2xl font-bold">{co.payment}</h2>
            <div className="mt-5 grid gap-3 font-sans sm:grid-cols-2">
              {['cod', 'bank'].map((k) => (
                <label key={k} className="flex cursor-pointer items-center gap-3 rounded-2xl bg-navy-900/[0.04] p-4 text-sm font-semibold ring-2 ring-transparent transition hover:bg-navy-900/[0.06] has-[:checked]:bg-wine-700/[0.06] has-[:checked]:ring-wine-700/60">
                  <input type="radio" name="payment" value={k} checked={f.payment === k} onChange={() => setF((s) => ({ ...s, payment: k }))} className="size-4 accent-wine-700" />
                  {t.ord.pay[k]}
                </label>
              ))}
            </div>
            {f.payment === 'bank' && <p className="mt-3 font-sans text-sm text-navy-900/65">{co.bankHint}</p>}
          </div>
        </div>

        <aside className={`${card} lg:sticky lg:top-24`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">{co.summary}</h2>
            <TypeBadge type={isWs ? 'wholesale' : 'retail'} />
          </div>
          {!wholesale && user.status === 'pending' && <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 font-sans text-sm text-amber-900">{co.pendingAcc}</p>}

          <ul className="mt-5 grid gap-5">
            {lines.map((l) => {
              const need = l.minQty - l.qty
              return (
                <li key={l.id} className="font-sans">
                  <div className="flex gap-3">
                    <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-sand">{l.image && <img src={l.image} alt="" className="size-full object-cover" />}</div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold leading-snug">{l.name[lang]}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm">
                        <span className="font-num text-lg text-wine-700">{vnd.format(l.price)}</span>
                        {l.isWholesale && <><span className="text-navy-900/45 line-through">{vnd.format(l.retail)}</span><span className="rounded-full bg-navy-900 px-2 py-0.5 text-[11px] font-semibold text-chalk">{co.wsApplied}</span></>}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div role="group" aria-label={t.detail.qty} className="flex items-center gap-2">
                      <button type="button" aria-label={t.detail.decrease} disabled={buyId && l.qty <= 1} onClick={() => setLineQty(l.id, l.qty - 1)} className={step}>−</button>
                      <output className="w-8 text-center font-num text-xl">{l.qty}</output>
                      <button type="button" aria-label={t.detail.increase} onClick={() => setLineQty(l.id, l.qty + 1)} className={step}>+</button>
                    </div>
                    <p className="font-num text-xl">{vnd.format(l.price * l.qty)}</p>
                  </div>
                  {wholesale && need > 0 && (
                    <button type="button" onClick={() => setLineQty(l.id, l.minQty)} className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-3 py-2 text-left text-xs text-emerald-900 transition hover:bg-emerald-100">
                      <span>{co.wsNudge.replace('{n}', need).replace('{price}', vnd.format(l.wholesale)).replace('{save}', vnd.format((l.retail - l.wholesale) * l.minQty))}</span>
                      <span className="shrink-0 font-bold">{co.wsTake}</span>
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          <dl className="mt-6 grid gap-2 border-t border-navy-900/10 pt-5 font-sans text-sm">
            {savings > 0 && (
              <>
                <div className="flex justify-between text-navy-900/65"><dt>{co.retailTotal}</dt><dd className="line-through">{vnd.format(total + savings)}</dd></div>
                <div className="flex justify-between font-semibold text-emerald-700"><dt>{co.saved}</dt><dd>−{vnd.format(savings)}</dd></div>
              </>
            )}
            <div className="mt-1 flex items-baseline justify-between"><dt className="font-semibold">{co.total}</dt><dd className="font-num text-3xl text-wine-700">{vnd.format(total)}</dd></div>
          </dl>
          <p className="mt-3 font-sans text-xs leading-relaxed text-navy-900/55">{co.ship}</p>

          <button type="submit" disabled={busy} className={`${submitClass} mt-5 w-full`}>
            {busy ? <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-chalk/40 border-t-chalk" /> : <>{co.place}<Icon name="arrow" className="size-4" /></>}
          </button>
          <p className="mt-3 flex gap-2 font-sans text-xs leading-relaxed text-navy-900/60"><Icon name="clock" className="mt-0.5 size-4 shrink-0" />{co.flow}</p>
        </aside>
      </form>
    </section>
  )
}

export default function CheckoutPage() {
  const user = useSelector(selectUser)
  const loc = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />
  return <Checkout user={user} />
}