import { useDispatch, useSelector } from 'react-redux'
import { useT } from '../hooks/useT'
import { setSort, setPrice, resetFilters } from '../store/filtersSlice'

function Group({ legend, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 font-semibold">{legend}</legend>
      <div className="grid gap-1.5">
        {options.map((label, i) => (
          <label key={label} className="flex cursor-pointer items-center gap-2 text-navy-900/80 has-checked:font-semibold has-checked:text-wine-700">
            <input type="radio" name={legend} checked={value === i} onChange={() => onChange(i)} className="accent-wine-700" />
            {label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// Bottom sheet on mobile/tablet, sticky sidebar on desktop (same markup)
export default function FilterPanel({ open, onClose, count }) {
  const { t } = useT()
  const dispatch = useDispatch()
  const { sort, price } = useSelector((s) => s.filters)

  return (
    <>
      {open && <button type="button" aria-label="Close" onClick={onClose} className="fixed inset-0 z-40 bg-navy-950/50 lg:hidden" />}
      <aside className={`fixed inset-x-0 bottom-0 z-50 grid max-h-[80vh] gap-6 overflow-y-auto rounded-t-3xl bg-paper p-6 shadow-2xl transition-transform duration-300 lg:visible lg:sticky lg:top-24 lg:z-auto lg:max-h-none lg:translate-y-0 lg:self-start lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none ${open ? 'visible translate-y-0' : 'invisible translate-y-full'}`}>
        <Group legend={t.shop.price} options={t.shop.prices} value={price} onChange={(i) => dispatch(setPrice(i))} />
        <Group legend={t.shop.sort} options={t.shop.sorts} value={sort} onChange={(i) => dispatch(setSort(i))} />
        <button type="button" onClick={() => dispatch(resetFilters())} className="justify-self-start text-sm font-semibold text-wine-700 underline underline-offset-4">{t.shop.reset}</button>
        <button type="button" onClick={onClose} className="rounded-full bg-navy-900 py-3 font-semibold text-chalk lg:hidden">{t.shop.show} ({count})</button>
      </aside>
    </>
  )
}
