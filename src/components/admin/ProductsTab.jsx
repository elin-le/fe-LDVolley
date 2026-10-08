import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useT } from '../../hooks/useT'
import { updateProduct } from '../../store/productsSlice'
import { vnd } from '../../utils/pricing'
import { Field } from '../AuthLayout'

function ProductRow({ product }) {
  const { t, lang } = useT()
  const dispatch = useDispatch()
  const [d, setD] = useState({
    price: product.price, wholesale: product.wholesale, minQty: product.minQty,
    images: [0, 1, 2].map((i) => product.images[i] ?? ''),
  })
  const [saved, setSaved] = useState(false)
  const setImage = (i, v) => setD((s) => ({ ...s, images: s.images.map((x, n) => (n === i ? v : x)) }))

  const save = (e) => {
    e.preventDefault()
    dispatch(updateProduct({
      id: product.id, price: Number(d.price), wholesale: Number(d.wholesale), minQty: Number(d.minQty),
      images: d.images.map((s) => s.trim()).filter(Boolean),
    }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <li>
      <details className="group rounded-2xl border border-navy-900/15 bg-white">
        <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 p-4">
          <span className="font-semibold">{product.name[lang]}</span>
          <span className="font-num text-lg text-navy-900/70">{vnd.format(product.price)} / {vnd.format(product.wholesale)}</span>
        </summary>
        <form onSubmit={save} className="grid gap-4 border-t border-navy-900/10 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t.admin.retail} type="number" min="0" required value={d.price} onChange={(e) => setD({ ...d, price: e.target.value })} />
            <Field label={t.admin.wholesale} type="number" min="0" max={d.price} required value={d.wholesale} onChange={(e) => setD({ ...d, wholesale: e.target.value })} />
            <Field label={t.admin.minQty} type="number" min="1" required value={d.minQty} onChange={(e) => setD({ ...d, minQty: e.target.value })} />
          </div>
          <fieldset className="grid gap-3">
            <legend className="mb-1 text-sm font-semibold">{t.admin.images}</legend>
            {d.images.map((src, i) => (
              <input key={i} type="url" value={src} onChange={(e) => setImage(i, e.target.value)} placeholder="https://" aria-label={`${t.admin.images} ${i + 1}`} className="rounded-xl border border-navy-900/25 px-4 py-2.5 outline-none focus-visible:border-wine-700" />
            ))}
          </fieldset>
          <button type="submit" className="justify-self-start rounded-full bg-wine-700 px-6 py-2.5 font-semibold text-chalk hover:bg-navy-900">{saved ? t.admin.saved : t.admin.save}</button>
        </form>
      </details>
    </li>
  )
}

export default function ProductsTab() {
  const items = useSelector((s) => s.products.items)
  return <ul className="grid gap-3">{items.map((p) => <ProductRow key={p.id} product={p} />)}</ul>
}
