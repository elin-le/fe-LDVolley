import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { addToCart } from '../store/cartSlice'
import { useT } from '../hooks/useT'
import BallMark from './BallMark'
import PriceTag from './PriceTag'

export default function ProductCard({ product, className = '' }) {
  const { t, lang } = useT()
  const dispatch = useDispatch()
  const [added, setAdded] = useState(false)
  const [first, second] = product.images.filter(Boolean)
  const name = product.name[lang]

  const handleAdd = () => {
    dispatch(addToCart({ id: product.id }))
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }

  return (
    <article className={`flex flex-col ${className}`}>
      <Link to={`/products/${product.id}`} aria-label={name} className={`group relative grid aspect-4/5 place-items-center overflow-hidden rounded-3xl bg-linear-to-br ${product.tone}`}>
        {first ? <img src={first} alt={name} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <BallMark className="w-1/2 text-chalk/80" />}
        {second && <img src={second} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        {product.best && <span className="absolute left-4 top-4 rounded-full bg-paper px-3 py-1 text-sm font-semibold text-wine-700">{t.products.badge}</span>}
      </Link>
      <h3 className="mt-4 text-xl font-semibold"><Link to={`/products/${product.id}`} className="hover:text-wine-700">{name}</Link></h3>
      <div className="mt-1"><PriceTag product={product} /></div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Link to={`/checkout?buy=${product.id}&qty=1`} className="rounded-full bg-wine-700 px-3 py-2 text-center text-sm font-semibold text-chalk transition hover:bg-navy-900 active:scale-95">{t.buy.now}</Link>
        <button type="button" onClick={handleAdd} className="rounded-full px-3 py-2 text-sm font-semibold ring-1 ring-navy-900/30 transition hover:bg-navy-900 hover:text-chalk active:scale-95">
          {added ? t.products.added : t.products.add}
        </button>
      </div>
    </article>
  )
}