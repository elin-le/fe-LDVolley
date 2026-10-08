import { useDispatch, useSelector } from 'react-redux'
import { useT } from '../hooks/useT'
import { setQuery, setCategory } from '../store/filtersSlice'

export default function FilterBar({ onOpenPanel }) {
  const { t } = useT()
  const dispatch = useDispatch()
  const { query, category, sort, price } = useSelector((s) => s.filters)
  const active = (sort !== 0) + (price !== 0)
  const cats = [['all', t.shop.all], ...Object.entries(t.categories.items).map(([k, v]) => [k, v[0]])]

  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <input
          type="search"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          placeholder={t.shop.search}
          aria-label={t.shop.search}
          className="min-w-0 flex-1 rounded-full border border-navy-900/25 bg-white px-4 py-2.5 outline-none focus-visible:border-wine-700"
        />
        <button type="button" onClick={onOpenPanel} className="shrink-0 rounded-full bg-navy-900 px-4 py-2.5 font-semibold text-chalk lg:hidden">
          {t.shop.filters}
          {active > 0 && <span className="ml-2 rounded-full bg-wine-600 px-2 font-num">{active}</span>}
        </button>
      </div>
      <div role="group" aria-label={t.shop.category} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0">
        {cats.map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={category === key}
            onClick={() => dispatch(setCategory(key))}
            className={`shrink-0 rounded-full border px-4 py-1.5 transition ${category === key ? 'border-navy-900 bg-navy-900 text-chalk' : 'border-navy-900/25 hover:border-wine-700 hover:text-wine-700'}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
