import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useT } from '../../hooks/useT'
import { updateProduct } from '../../store/productsSlice'
import { deleteImage, isCloudinaryReady, uploadImage } from '../../services/cloudinary'
import { vnd } from '../../utils/pricing'
import { Field, Icon } from '../AuthLayout'

const SLOTS = 3

/* One photo slot: upload (drag & drop or click), replace, remove, or paste a link */
function Slot({ index, url, busy, ready, onFile, onUrl, onRemove }) {
  const { t } = useT()
  const m = t.adm.p
  const input = useRef(null)
  const [over, setOver] = useState(false)
  const [text, setText] = useState(url)
  useEffect(() => setText(url), [url])
  const pick = (file) => file && ready && onFile(file)

  return (
    <div className="grid gap-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true) }} onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]) }}
        className={`group relative grid aspect-4/5 place-items-center overflow-hidden rounded-2xl bg-navy-900/[0.04] ring-2 transition ${over ? 'ring-wine-700' : 'ring-transparent'}`}
      >
        {url ? <img src={url} alt="" className="size-full object-cover" /> : (
          <button type="button" disabled={!ready || busy} onClick={() => input.current.click()} className="grid place-items-center gap-2 px-3 text-center text-xs font-semibold text-navy-900/55 disabled:opacity-50">
            <Icon name="image" className="size-8" />
            {ready ? m.drop : m.upload}
          </button>
        )}
        {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-bold text-wine-700">{m.main}</span>}
        {url && !busy && (
          <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            {ready && <button type="button" onClick={() => input.current.click()} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/95 py-2 text-xs font-semibold shadow"><Icon name="upload" className="size-3.5" />{m.replace}</button>}
            <button type="button" onClick={onRemove} aria-label={m.remove} className="grid size-9 place-items-center rounded-xl bg-white/95 text-wine-700 shadow"><Icon name="trash" className="size-4" /></button>
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-content-center justify-items-center gap-2 bg-white/80 text-xs font-semibold backdrop-blur-sm">
            <span className="size-7 animate-spin rounded-full border-[3px] border-wine-700/25 border-t-wine-700" />
            {m.uploading}
          </div>
        )}
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => { pick(e.target.files[0]); e.target.value = '' }} />
      </div>
      <input type="url" value={text} placeholder={m.paste} aria-label={`${m.paste} ${index + 1}`}
        onChange={(e) => setText(e.target.value)} onBlur={() => text.trim() !== url && onUrl(text.trim())}
        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), e.currentTarget.blur())}
        className="w-full rounded-xl border border-transparent bg-navy-900/[0.04] px-3 py-2 text-xs outline-none focus:border-wine-700/40 focus:bg-white focus:ring-4 focus:ring-wine-700/10" />
    </div>
  )
}

function Editor({ product, onClose }) {
  const { t, lang } = useT()
  const m = t.adm.p
  const dispatch = useDispatch()
  const dialog = useRef(null)
  const ready = isCloudinaryReady()
  const [d, setD] = useState({ price: product.price, wholesale: product.wholesale, minQty: product.minQty, images: Array.from({ length: SLOTS }, (_, i) => product.images[i] ?? '') })
  const [busy, setBusy] = useState({})
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)
  // Deletions are deferred until Save so a cancelled edit never breaks the live product.
  const trash = useRef(new Set()) // original images that were replaced/removed
  const fresh = useRef(new Set()) // uploaded in this session, not saved yet

  useEffect(() => { dialog.current?.showModal() }, [])

  const swap = (i, next) => {
    const old = d.images[i]
    if (old && old !== next) {
      if (fresh.current.has(old)) { fresh.current.delete(old); deleteImage(old) } // never saved: safe to delete now
      else trash.current.add(old)
    }
    if (next) trash.current.delete(next)
    setD((s) => ({ ...s, images: s.images.map((x, n) => (n === i ? next : x)) }))
  }

  const onFile = async (i, file) => {
    setMsg(''); setBusy((b) => ({ ...b, [i]: true }))
    try {
      const url = await uploadImage(file)
      fresh.current.add(url)
      swap(i, url) // the new link is filled in automatically
    } catch (e) { setMsg(e.message === 'badFile' ? m.badFile : m.uploadFail) }
    setBusy((b) => ({ ...b, [i]: false }))
  }

  const close = () => {
    fresh.current.forEach((u) => deleteImage(u)) // discard unsaved uploads
    onClose()
  }

  const save = async (e) => {
    e.preventDefault()
    if (Number(d.wholesale) > Number(d.price)) return setMsg(m.priceErr)
    setSaving(true)
    const images = d.images.map((s) => s.trim()).filter(Boolean)
    dispatch(updateProduct({ id: product.id, price: Number(d.price), wholesale: Number(d.wholesale), minQty: Number(d.minQty), images }))
    fresh.current.clear()
    const results = await Promise.all([...trash.current].filter((u) => !images.includes(u)).map(deleteImage))
    if (results.includes('no-endpoint')) window.alert(m.noDelete)
    else if (results.includes('failed')) window.alert(m.delFail)
    onClose()
  }

  return (
    <dialog ref={dialog} onClose={close} onCancel={(e) => { e.preventDefault(); close() }}
      className="m-auto w-[min(56rem,calc(100vw-1.5rem))] max-w-none rounded-3xl bg-paper p-0 text-navy-900 shadow-2xl backdrop:bg-navy-950/60 backdrop:backdrop-blur-sm">
      <form onSubmit={save} className="max-h-[92svh] overflow-y-auto p-5 font-sans sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-navy-900/60">{m.editTitle}</p>
            <h3 className="font-display text-2xl font-extrabold sm:text-3xl">{product.name[lang]}</h3>
          </div>
          <button type="button" onClick={close} aria-label={m.cancel} className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-navy-900/20 hover:bg-navy-900 hover:text-chalk"><Icon name="x" className="size-5" /></button>
        </div>

        <h4 className="mt-6 text-sm font-bold">{m.photos}</h4>
        {!ready && <p className="mt-2 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">{m.cfgMissing}</p>}
        <div className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
          {d.images.map((url, i) => <Slot key={i} index={i} url={url} ready={ready} busy={Boolean(busy[i])} onFile={(f) => onFile(i, f)} onUrl={(u) => swap(i, u)} onRemove={() => swap(i, '')} />)}
        </div>

        <h4 className="mt-7 text-sm font-bold">{m.pricing}</h4>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Field label={t.admin.retail} type="number" min="0" required value={d.price} onChange={(e) => setD({ ...d, price: e.target.value })} />
          <Field label={t.admin.wholesale} type="number" min="0" max={d.price} required value={d.wholesale} onChange={(e) => setD({ ...d, wholesale: e.target.value })} />
          <Field label={t.admin.minQty} type="number" min="1" required value={d.minQty} onChange={(e) => setD({ ...d, minQty: e.target.value })} />
        </div>
        <p className="mt-2 text-xs text-navy-900/55">{m.minHint}</p>

        {msg && <p role="alert" className="mt-4 rounded-2xl bg-wine-600/10 px-4 py-3 text-sm font-medium text-wine-700">{msg}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" onClick={close} className="rounded-2xl px-6 py-3 text-sm font-semibold ring-1 ring-navy-900/25 transition hover:bg-navy-900 hover:text-chalk">{m.cancel}</button>
          <button type="submit" disabled={saving || Object.values(busy).some(Boolean)} className="rounded-2xl bg-linear-to-r from-wine-700 to-wine-600 px-8 py-3 text-sm font-semibold text-chalk shadow-lg shadow-wine-700/25 transition hover:-translate-y-0.5 disabled:opacity-60">{saving ? m.saving : t.admin.save}</button>
        </div>
      </form>
    </dialog>
  )
}

export default function ProductsTab() {
  const { t, lang } = useT()
  const m = t.adm.p
  const items = useSelector((s) => s.products.items)
  const [editing, setEditing] = useState(null)
  const product = items.find((p) => p.id === editing)

  return (
    <div>
      <h2 className="font-display text-3xl font-extrabold">{m.title}</h2>
      <p className="mt-1 text-sm text-navy-900/65">{m.sub}</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((p) => {
          const imgs = p.images.filter(Boolean)
          return (
            <li key={p.id} className="overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-22px_rgba(11,27,58,.4)] ring-1 ring-navy-900/8">
              <div className={`grid h-44 grid-cols-3 gap-0.5 bg-linear-to-br ${p.tone}`}>
                {imgs.length ? imgs.slice(0, 3).map((u, i) => <img key={u + i} src={u} alt="" loading="lazy" className={`size-full object-cover ${imgs.length === 1 ? 'col-span-3' : imgs.length === 2 && i === 0 ? 'col-span-2' : ''}`} />) : <span className="col-span-3 grid place-items-center text-chalk/70"><Icon name="image" className="size-10" /></span>}
              </div>
              <div className="p-4">
                <p className="line-clamp-1 font-semibold">{p.name[lang]}</p>
                <p className="mt-0.5 text-xs text-navy-900/55">{imgs.length}/{SLOTS} {m.photoCount} · {t.categories.items[p.category][0]}</p>
                <div className="mt-3 flex items-end justify-between gap-2">
                  <div className="font-num leading-tight">
                    <p className="text-xl text-wine-700">{vnd.format(p.price)}</p>
                    <p className="text-sm text-navy-900/60">{t.admin.wholesale}: {vnd.format(p.wholesale)} · ≥{p.minQty}</p>
                  </div>
                  <button type="button" onClick={() => setEditing(p.id)} className="flex items-center gap-1.5 rounded-xl bg-navy-900 px-4 py-2 text-sm font-semibold text-chalk transition hover:bg-wine-700"><Icon name="edit" className="size-4" />{m.edit}</button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {product && <Editor key={product.id} product={product} onClose={() => setEditing(null)} />}
    </div>
  )
}