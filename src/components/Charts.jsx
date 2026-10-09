import { useId, useState } from 'react'

// Axis with "nice" steps. Integer mode keeps count axes on whole numbers.
function axis(max, integer) {
  const raw = Math.max(max, 1) / 4
  const p = 10 ** Math.floor(Math.log10(raw))
  const m = raw / p
  const cand = integer ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10]
  const step = Math.max(integer ? 1 : 0, (cand.find((c) => c >= m) ?? 10) * p)
  return { step, top: Math.max(step * 4, Math.ceil(max / step) * step) }
}

const W = 640, L = 40, R = 10, T = 14, B = 28

function Grid({ top, step, y, fmt }) {
  return [0, 1, 2, 3, 4].filter((i) => i * step <= top).map((i) => (
    <g key={i}>
      <line x1={L} x2={W - R} y1={y(i * step)} y2={y(i * step)} className="stroke-navy-900/10" />
      <text x={L - 8} y={y(i * step) + 4} textAnchor="end" className="fill-navy-900/45 text-[11px]">{fmt(i * step)}</text>
    </g>
  ))
}

function Tip({ left, children }) {
  return (
    <div className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-navy-900 px-3 py-2 font-sans text-xs text-chalk shadow-lg" style={{ left: `${left}%` }}>
      {children}
    </div>
  )
}

/* Stacked bars: data = [{ label, parts: [a, b] }] */
export function StackedBars({ data, names, fills, height = 230 }) {
  const [hover, setHover] = useState(null)
  const H = height
  const max = Math.max(0, ...data.map((d) => d.parts[0] + d.parts[1]))
  const { top, step } = axis(max, true)
  const ih = H - T - B
  const bw = (W - L - R) / data.length
  const y = (v) => T + ih - (v / top) * ih
  const every = data.length > 12 ? 2 : 1
  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-[480px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={names.join(' / ')}>
          <Grid top={top} step={step} y={y} fmt={(v) => v} />
          {data.map((d, i) => {
            const x = L + i * bw + bw * 0.2
            const w = bw * 0.6
            const a = d.parts[0], b = d.parts[1]
            return (
              <g key={d.label} opacity={hover === null || hover === i ? 1 : 0.55} className="transition-opacity">
                {a > 0 && <rect x={x} y={y(a)} width={w} height={y(0) - y(a)} rx="3" className={`${fills[0]} animate-grow-y`} style={{ animationDelay: `${i * 35}ms` }} />}
                {b > 0 && <rect x={x} y={y(a + b)} width={w} height={y(a) - y(a + b)} rx="3" className={`${fills[1]} animate-grow-y`} style={{ animationDelay: `${i * 35 + 120}ms` }} />}
                {i % every === 0 && <text x={x + w / 2} y={H - 8} textAnchor="middle" className="fill-navy-900/55 text-[11px]">{d.label}</text>}
                <rect x={L + i * bw} y={T} width={bw} height={ih + B} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={`${d.label}: ${a + b}`} />
              </g>
            )
          })}
        </svg>
        {hover !== null && (
          <Tip left={((L + (hover + 0.5) * bw) / W) * 100}>
            <p className="font-semibold">{data[hover].label}</p>
            {names.map((n, k) => <p key={n}>{n}: <b>{data[hover].parts[k]}</b></p>)}
          </Tip>
        )}
      </div>
    </div>
  )
}

/* Area line: data = [{ label, value }] */
export function AreaLine({ data, format, short, name, height = 230 }) {
  const [hover, setHover] = useState(null)
  const gid = useId()
  const H = height
  const max = Math.max(0, ...data.map((d) => d.value))
  const { top, step } = axis(max, false)
  const ih = H - T - B
  const bw = (W - L - R) / data.length
  const px = (i) => L + (i + 0.5) * bw
  const y = (v) => T + ih - (v / top) * ih
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${px(i)} ${y(d.value)}`).join('')
  const area = `${line}L${px(data.length - 1)} ${y(0)}L${px(0)} ${y(0)}Z`
  const every = data.length > 12 ? 2 : 1
  return (
    <div className="overflow-x-auto">
      <div className="relative min-w-[480px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={name}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className="[stop-color:var(--color-wine-600)]" stopOpacity="0.32" />
              <stop offset="100%" className="[stop-color:var(--color-wine-600)]" stopOpacity="0" />
            </linearGradient>
          </defs>
          <Grid top={top} step={step} y={y} fmt={short} />
          <path d={area} fill={`url(#${gid})`} className="animate-fade" />
          <path d={line} pathLength="1" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-draw stroke-wine-700" style={{ animationDuration: '1.1s' }} />
          {data.map((d, i) => (
            <g key={d.label}>
              {i % every === 0 && <text x={px(i)} y={H - 8} textAnchor="middle" className="fill-navy-900/55 text-[11px]">{d.label}</text>}
              <circle cx={px(i)} cy={y(d.value)} r={hover === i ? 5 : 3} className="animate-fade fill-white stroke-wine-700 transition-all" strokeWidth="2" />
              <rect x={px(i) - bw / 2} y={T} width={bw} height={ih + B} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0} aria-label={`${d.label}: ${format(d.value)}`} />
            </g>
          ))}
        </svg>
        {hover !== null && (
          <Tip left={(px(hover) / W) * 100}>
            <p className="font-semibold">{data[hover].label}</p>
            <p>{format(data[hover].value)}</p>
          </Tip>
        )}
      </div>
    </div>
  )
}

/* Donut: slices = [{ label, value, stroke, bg }] */
export function Donut({ slices, center, format }) {
  const total = slices.reduce((s, x) => s + x.value, 0)
  let acc = 0
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
      <div className="relative size-36 shrink-0">
        <svg viewBox="0 0 40 40" className="size-full -rotate-90" role="img" aria-label={slices.map((s) => `${s.label}: ${format(s.value)}`).join(', ')}>
          <circle cx="20" cy="20" r="15.9155" fill="none" strokeWidth="5" className="stroke-navy-900/8" />
          {total > 0 && slices.map((s) => {
            const pct = (s.value / total) * 100
            const el = (
              <circle key={s.label} cx="20" cy="20" r="15.9155" fill="none" strokeWidth="5" pathLength="100"
                strokeDasharray={`${Math.max(pct - 0.8, 0)} ${100 - Math.max(pct - 0.8, 0)}`} strokeDashoffset={-acc} className={`${s.stroke} animate-fade`} />
            )
            acc += pct
            return el
          })}
        </svg>
        <div className="absolute inset-0 grid place-content-center text-center font-sans">{center}</div>
      </div>
      <ul className="grid min-w-0 flex-1 gap-2 font-sans text-sm">
        {slices.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span className={`size-2.5 shrink-0 rounded-full ${s.bg}`} />
            <span className="min-w-0 flex-1 truncate">{s.label}</span>
            <span className="font-semibold tabular-nums">{total ? Math.round((s.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* Horizontal bars: items = [{ label, value, right, sub }] */
export function HBars({ items, bar = 'bg-wine-700' }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ul className="grid gap-4 font-sans">
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-semibold">{it.label}</span>
            <span className="shrink-0 tabular-nums text-navy-900/70">{it.right}</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-navy-900/8">
            <div className={`h-full rounded-full ${bar} transition-[width] duration-700 ease-out`} style={{ width: `${(it.value / max) * 100}%`, transitionDelay: `${i * 60}ms` }} />
          </div>
          {it.sub && <p className="mt-1 text-xs text-navy-900/50">{it.sub}</p>}
        </li>
      ))}
    </ul>
  )
}