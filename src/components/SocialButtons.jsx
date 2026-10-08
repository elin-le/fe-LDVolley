import { useT } from '../hooks/useT'

const Google = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
    <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z" />
    <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z" />
  </svg>
)
const Facebook = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5">
    <path fill="#1877F2" d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z" />
  </svg>
)

const PROVIDERS = [['google', 'Google', Google], ['facebook', 'Facebook', Facebook]]

export default function SocialButtons({ onSelect, disabled }) {
  const { t } = useT()
  return (
    <div className="font-sans">
      <div className="grid grid-cols-2 gap-3">
        {PROVIDERS.map(([id, name, Logo]) => (
          <button key={id} type="button" disabled={disabled} onClick={() => onSelect(id)} aria-label={t.auth.social[id]}
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-white py-3 text-sm font-semibold text-navy-900 shadow-[0_1px_0_rgba(11,27,58,.06),0_6px_16px_-8px_rgba(11,27,58,.3)] ring-1 ring-navy-900/10 transition hover:-translate-y-0.5 hover:ring-navy-900/25 active:translate-y-0 active:scale-[.98] disabled:pointer-events-none disabled:opacity-60">
            <Logo />
            {name}
          </button>
        ))}
      </div>
      <div className="my-6 flex items-center gap-4 text-xs text-navy-900/45">
        <span className="h-px flex-1 bg-navy-900/10" />
        {t.auth.social.or}
        <span className="h-px flex-1 bg-navy-900/10" />
      </div>
    </div>
  )
}