import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useT } from '../hooks/useT'
import { removeFromCart, setQty } from '../store/cartSlice'
import { selectIsWholesale } from '../store/authSlice'
import { siteConfig } from '../config'
import { unitPrice, vnd } from '../utils/pricing'

const step = 'grid size-8 place-items-center rounded-full border border-navy-900/30 transition hover:bg-navy-900 hover:text-chalk'

export default function CartPage() {
  const { t, lang } = useT()
  const dispatch = useDispatch()
  const items = useSelector((s) => s.cart.items)
  const all = useSelector((s) => s.products.items)
  const wholesale = useSelector(selectIsWholesale)
  const rows = Object.entries(items).map(([id, qty]) => ({ p: all.find((x) => x.id === id), qty })).filter((r) => r.p)
  const total = rows.reduce((sum, { p, qty }) => sum + unitPrice(p, qty, wholesale) * qty, 0)

  if (!rows.length) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-3xl font-semibold">{t.cart.empty}</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-wine-700 px-7 py-3 font-semibold text-chalk hover:bg-navy-900">{t.cart.shop}</Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="animate-rise text-4xl font-extrabold sm:text-5xl">{t.cart.title}</h1>
      <ul className="mt-8 grid gap-4">
        {rows.map(({ p, qty }) => {
          const price = unitPrice(p, qty, wholesale)
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-navy-900/15 bg-white p-3">
              <Link to={`/products/${p.id}`} className={`size-20 shrink-0 overflow-hidden rounded-xl bg-linear-to-br ${p.tone}`}>
                {p.images[0] && <img src={p.images[0]} alt="" className="size-full object-cover" />}
              </Link>
              <div className="min-w-0 flex-1 basis-40">
                <Link to={`/products/${p.id}`} className="font-semibold hover:text-wine-700">{p.name[lang]}</Link>
                <p className="font-num text-lg text-wine-700">
                  {vnd.format(price)}
                  {price < p.price && <span className="ml-2 text-navy-900/50 line-through">{vnd.format(p.price)}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label={t.detail.decrease} onClick={() => dispatch(setQty({ id: p.id, qty: qty - 1 }))} className={step}>−</button>
                <output className="w-8 text-center font-num text-xl">{qty}</output>
                <button type="button" aria-label={t.detail.increase} onClick={() => dispatch(setQty({ id: p.id, qty: qty + 1 }))} className={step}>+</button>
              </div>
              <p className="w-32 text-right font-num text-xl">{vnd.format(price * qty)}</p>
              <button type="button" onClick={() => dispatch(removeFromCart(p.id))} className="text-sm text-navy-900/60 underline underline-offset-4 hover:text-wine-700">{t.cart.remove}</button>
            </li>
          )
        })}
      </ul>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-navy-900/15 pt-6">
        <p className="max-w-xs text-sm text-navy-900/70">{t.cart.note}</p>
        <p className="font-num text-2xl">{t.cart.total}: <span className="text-3xl text-wine-700">{vnd.format(total)}</span></p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link to="/checkout" className="rounded-full bg-wine-700 px-8 py-3 font-semibold text-chalk transition hover:bg-navy-900 active:scale-95">{t.cart.checkout}</Link>
        <a href={siteConfig.contactUrl} target="_blank" rel="noopener noreferrer" className="text-navy-900/70 underline underline-offset-4 hover:text-wine-700">{t.cart.contact}</a>
      </div>
    </section>
  )
}