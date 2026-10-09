import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router'
import { useT } from '../hooks/useT'
import { addToCart } from '../store/cartSlice'
import { selectIsWholesale, selectUser } from '../store/authSlice'
import { siteConfig } from '../config'
import { unitPrice, vnd } from '../utils/pricing'
import ProductGallery from '../components/ProductGallery'
import ProductCard from '../components/ProductCard'
import PriceTag from '../components/PriceTag'

const step = 'grid size-10 place-items-center rounded-full border border-navy-900/30 text-xl transition hover:bg-navy-900 hover:text-chalk active:scale-90'
const btn = 'rounded-full px-7 py-3 text-center font-semibold transition active:scale-95'

function Detail({ product, all }) {
  const { t, lang } = useT()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const wholesale = useSelector(selectIsWholesale)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const name = product.name[lang]
  const related = all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => (b.category === product.category) - (a.category === product.category))
    .slice(0, 4)

  const add = () => dispatch(addToCart({ id: product.id, qty }))
  const handleAdd = () => { add(); setAdded(true); setTimeout(() => setAdded(false), 1600) }
  const handleBuyNow = () => navigate(`/checkout?buy=${product.id}&qty=${qty}`)

  let wsNote = <Link to="/register" className="text-wine-700 underline underline-offset-4">{t.ws.guest}</Link>
  if (wholesale) wsNote = t.ws.min.replace('{n}', product.minQty)
  else if (user) wsNote = t.ws.pending

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link to="/products" className="text-navy-900/70 underline underline-offset-4 hover:text-wine-700">{t.detail.back}</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="animate-rise lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images} alt={name} tone={product.tone} />
        </div>

        <div className="animate-rise [animation-delay:150ms]">
          <Link to={`/products?cat=${product.category}`} className="rounded-full bg-sand px-3 py-1 text-sm hover:bg-wine-300">{t.categories.items[product.category][0]}</Link>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{name}</h1>
          <div className="mt-4"><PriceTag product={product} size="text-4xl" /></div>
          <p className="mt-2 text-sm text-navy-900/70">{wsNote}</p>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-navy-900/80">{product.desc[lang]}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div role="group" aria-label={t.detail.qty} className="flex items-center gap-3">
              <button type="button" aria-label={t.detail.decrease} onClick={() => setQty((q) => Math.max(1, q - 1))} className={step}>−</button>
              <output className="w-10 text-center font-num text-2xl">{qty}</output>
              <button type="button" aria-label={t.detail.increase} onClick={() => setQty((q) => q + 1)} className={step}>+</button>
            </div>
            <p className="font-num text-xl text-navy-900/70">{t.ws.total}: <span className="text-2xl text-navy-900">{vnd.format(unitPrice(product, qty, wholesale) * qty)}</span></p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleBuyNow} className={`${btn} bg-wine-700 text-chalk hover:bg-navy-900`}>{t.buy.now}</button>
            <button type="button" onClick={handleAdd} className={`${btn} bg-navy-900 text-chalk hover:bg-wine-700`}>{added ? t.buy.added : t.buy.add}</button>
            <a href={siteConfig.contactUrl} target="_blank" rel="noopener noreferrer" className={`${btn} border border-navy-900/40 hover:bg-navy-900 hover:text-chalk sm:col-span-2`}>{t.buy.contact}</a>
          </div>
        </div>
      </div>

      <h2 className="mt-20 text-3xl font-extrabold sm:text-4xl">{t.detail.related}</h2>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {related.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useT()
  const all = useSelector((s) => s.products.items)
  const product = all.find((p) => p.id === id)
  if (!product) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-3xl font-semibold">{t.detail.notFound}</p>
        <Link to="/products" className="mt-6 inline-block text-wine-700 underline underline-offset-4">{t.detail.back}</Link>
      </section>
    )
  }
  return <Detail key={product.id} product={product} all={all} />
}