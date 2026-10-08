import { useId, useState } from 'react'
import { useT } from '../hooks/useT'
import BallMark from './BallMark'

/* ---------- icons ---------- */
const ICONS = {
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  mail: <><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 6L2 7" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <path d="M17.9 17.9A10.1 10.1 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A9.1 9.1 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M1 1l22 22" />,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
}

export function Icon({ name, className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {ICONS[name]}
    </svg>
  )
}

/* Tick that draws itself when a field becomes valid */
function Tick({ className = 'size-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path pathLength="1" d="M20 6 9 17l-5-5" className="animate-draw" />
    </svg>
  )
}

/* Big success mark: ring draws, then the tick */
export function SuccessMark() {
  return (
    <svg viewBox="0 0 72 72" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mb-6 size-20 text-emerald-600">
      <circle cx="36" cy="36" r="32" className="fill-emerald-500/10 stroke-emerald-500/25" />
      <circle pathLength="1" cx="36" cy="36" r="32" stroke="currentColor" className="animate-draw origin-center -rotate-90" style={{ animationDuration: '.9s' }} />
      <path pathLength="1" d="m23 37 9 9 17-19" stroke="currentColor" className="animate-draw" style={{ animationDelay: '.7s' }} />
    </svg>
  )
}

/* ---------- layout ---------- */
export default function AuthLayout({ title, subtitle, children, footer, badge }) {
  const { t } = useT()
  return (
    <section className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl gap-2 p-3 lg:grid-cols-[1fr_1.15fr]">
      <aside className="relative isolate hidden overflow-hidden rounded-[2rem] bg-navy-950 p-12 text-chalk lg:flex lg:flex-col lg:justify-end">
        <div aria-hidden="true" className="animate-blob absolute -left-24 -top-24 -z-10 size-[26rem] rounded-full bg-wine-600/70 blur-3xl" />
        <div aria-hidden="true" className="animate-blob absolute -bottom-32 right-[-6rem] -z-10 size-[28rem] rounded-full bg-navy-800 blur-3xl [animation-delay:-7s]" />
        <BallMark className="animate-spin-slow absolute -right-24 top-14 -z-10 size-[26rem] text-chalk/15" />
        <h2 className="max-w-md text-4xl font-extrabold leading-tight">{t.auth.sideTitle}</h2>
        <p className="mt-4 max-w-sm text-chalk/75">{t.auth.sideBody}</p>
      </aside>
      <div className="flex items-center px-3 py-10 sm:px-10">
        <div className="animate-rise mx-auto w-full max-w-md">
          {badge}
          <h1 className="text-4xl font-extrabold">{title}</h1>
          <p className="mt-2 font-sans text-[15px] leading-relaxed text-navy-900/65">{subtitle}</p>
          {children}
          {footer && <p className="mt-8 text-center font-sans text-sm text-navy-900/65">{footer}</p>}
        </div>
      </div>
    </section>
  )
}

/* ---------- field ---------- */
export function Field({ label, star, icon, valid, error, type = 'text', ...props }) {
  const id = useId()
  const { t } = useT()
  const [show, setShow] = useState(false)
  const isPw = type === 'password'
  return (
    <div className="grid gap-1.5 font-sans">
      <label htmlFor={id} className="text-[13px] font-semibold text-navy-900/80">
        {label}
        {star && <span aria-hidden="true" className="ml-0.5 text-wine-600">*</span>}
      </label>
      <div className="group relative">
        {icon && <Icon name={icon} className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-navy-900/35 transition-colors group-focus-within:text-wine-700" />}
        <input
          id={id}
          type={isPw && show ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-required={star || undefined}
          {...props}
          className={`w-full rounded-2xl border bg-navy-900/[0.04] py-3.5 pr-11 text-[15px] text-navy-900 outline-none transition placeholder:text-navy-900/35 hover:bg-navy-900/[0.06] focus:bg-white focus:shadow-[0_8px_24px_-12px_rgba(109,26,54,.35)] focus:ring-4 focus:ring-wine-700/10 ${icon ? 'pl-11' : 'pl-4'} ${error ? 'border-wine-600/60 bg-wine-600/[0.04]' : 'border-transparent focus:border-wine-700/40'}`}
        />
        {isPw ? (
          <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? t.auth.hidePw : t.auth.showPw}
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-xl text-navy-900/45 transition hover:bg-navy-900/5 hover:text-navy-900">
            <Icon name={show ? 'eyeOff' : 'eye'} className="size-[18px]" />
          </button>
        ) : valid ? (
          <span className="animate-check-in absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-emerald-500 text-white">
            <Tick className="size-3.5" />
          </span>
        ) : null}
      </div>
      {error && <p role="alert" className="text-xs font-medium text-wine-600">{error}</p>}
    </div>
  )
}

export const submitClass =
  'relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-linear-to-r from-wine-700 to-wine-600 py-3.5 font-sans font-semibold text-chalk shadow-lg shadow-wine-700/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-wine-700/30 active:translate-y-0 active:scale-[.98] disabled:pointer-events-none disabled:opacity-60'