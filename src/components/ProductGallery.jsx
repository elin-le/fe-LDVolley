import { useState } from 'react'
import BallMark from './BallMark'

// Main image + up to 3 thumbnails. Broken links are skipped; no valid image falls back to the mark.
export default function ProductGallery({ images = [], alt, tone }) {
  const [bad, setBad] = useState([])
  const [active, setActive] = useState(0)
  const list = images.filter((s) => s && !bad.includes(s)).slice(0, 3)
  const hide = (src) => setBad((b) => [...b, src])

  return (
    <div>
      <div className={`relative grid aspect-4/5 place-items-center overflow-hidden rounded-3xl bg-linear-to-br ${tone}`}>
        {list.length ? (
          <img key={list[active] ?? list[0]} src={list[active] ?? list[0]} alt={alt} onError={() => hide(list[active] ?? list[0])} className="animate-rise size-full object-cover" />
        ) : (
          <BallMark className="w-1/2 text-chalk/80" />
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
              aria-current={i === active}
              className={`size-16 overflow-hidden rounded-xl border-2 transition sm:size-20 ${i === active ? 'border-wine-700' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <img src={src} alt="" loading="lazy" onError={() => hide(src)} className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
