import { useT } from '../hooks/useT'
import { STATUS_FLOW, STATUS_TONE } from '../utils/orders'
import { Icon } from './AuthLayout'

export function StatusBadge({ status, className = '' }) {
  const { t } = useT()
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-sans text-xs font-semibold ring-1 ${STATUS_TONE[status]} ${className}`}>
      <span className={`size-1.5 rounded-full bg-current ${status === 'pending' ? 'animate-pulse' : ''}`} />
      {t.ord.status[status]}
    </span>
  )
}

export function TypeBadge({ type, className = '' }) {
  const { t } = useT()
  const ws = type === 'wholesale'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${ws ? 'bg-navy-900 text-chalk' : 'bg-sand text-navy-900/70'} ${className}`}>
      {ws ? t.ord.typeWholesale : t.ord.typeRetail}
    </span>
  )
}

export function VipBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 font-sans text-[11px] font-bold text-amber-800 ring-1 ring-amber-300/70">
      <Icon name="crown" className="size-3" />
      {label}
    </span>
  )
}

/* Progress of an order through pending -> confirmed -> shipping -> completed */
export function Stepper({ status }) {
  const { t } = useT()
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 font-sans text-sm font-semibold text-navy-900/60">
        <span className="grid size-7 place-items-center rounded-full bg-navy-900/10"><Icon name="x" className="size-4" /></span>
        {t.ord.status.cancelled}
      </div>
    )
  }
  const idx = STATUS_FLOW.indexOf(status)
  return (
    <ol className="grid grid-cols-4 font-sans">
      {STATUS_FLOW.map((s, i) => {
        const done = i < idx || status === 'completed'
        const current = i === idx && status !== 'completed'
        return (
          <li key={s} className="relative flex flex-col items-center gap-1.5 text-center">
            {i < STATUS_FLOW.length - 1 && (
              <span aria-hidden="true" className="absolute left-1/2 top-3.5 h-0.5 w-full bg-navy-900/10">
                <span className="block h-full bg-emerald-500 transition-all duration-700" style={{ width: i < idx ? '100%' : '0%' }} />
              </span>
            )}
            <span className={`relative z-10 grid size-7 place-items-center rounded-full text-xs font-bold transition-colors ${done ? 'bg-emerald-500 text-white' : current ? 'bg-wine-700 text-white ring-4 ring-wine-700/15' : 'bg-navy-900/10 text-navy-900/40'}`}>
              {done ? <Icon name="check" className="size-4" /> : i + 1}
            </span>
            <span className={`text-[11px] font-semibold leading-tight ${current ? 'text-wine-700' : done ? 'text-navy-900/80' : 'text-navy-900/40'}`}>{t.ord.my.step[s]}</span>
          </li>
        )
      })}
    </ol>
  )
}