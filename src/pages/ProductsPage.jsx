import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router'
import { useT } from '../hooks/useT'
import { setCategory, resetFilters } from '../store/filtersSlice'
import FilterBar from '../components/FilterBar'
import FilterPanel from '../components/FilterPanel'
import ProductCard from '../components/ProductCard'

const priceRanges = [[0, Infinity], [0, 500000], [500000, 1500000], [1500000, Infinity]]
const sorters = [() => 0, (a, b) => a.price - b.price, (a, b) => b.price - a.price]
// Accent-insensitive: "giay" finds "Giày"
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase()

export default function ProductsPage() {
  const { t } = useT()
  const dispatch = useDispatch()
  const [params] = useSearchParams()
  const [panelOpen, setPanelOpen] = useState(false)
  const products = useSelector((s) => s.products.items)
  const { query, category, sort, price } = useSelector((s) => s.filters)

  useEffect(() => {
    const cat = params.get('cat')
    if (cat) dispatch(setCategory(cat))
  }, [params, dispatch])

  const list = useMemo(() => {
    const q = norm(query.trim())
    const [min, max] = priceRanges[price]
    return products
      .filter((p) => (category === 'all' || p.category === category) && p.price >= min && p.price < max
        && (!q || norm(`${p.name.vi} ${p.name.en}`).includes(q)))
      .sort(sorters[sort])
  }, [products, query, category, sort, price])

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="animate-rise text-4xl font-extrabold sm:text-6xl">{t.shop.title}</h1>
      <div className="mt-6"><FilterBar onOpenPanel={() => setPanelOpen(true)} /></div>

      <div className="mt-8 gap-10 lg:grid lg:grid-cols-[14rem_1fr]">
        <FilterPanel open={panelOpen} onClose={() => setPanelOpen(false)} count={list.length} />
        <div>
          <p className="border-b border-navy-900/15 pb-3 font-num text-xl text-navy-900/70">{list.length} {t.shop.count}</p>
          {list.length ? (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 xl:grid-cols-3">
              {list.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="mt-6 rounded-3xl bg-sand p-8 text-center">
              <p className="text-2xl font-semibold">{t.shop.empty}</p>
              <p className="mt-2 text-navy-900/70">{t.shop.emptyHint}</p>
              <button type="button" onClick={() => dispatch(resetFilters())} className="mt-5 rounded-full bg-navy-900 px-6 py-2.5 font-semibold text-chalk hover:bg-wine-700">{t.shop.reset}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
