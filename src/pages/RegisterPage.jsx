import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router'
import { useT } from '../hooks/useT'
import { register, socialLogin } from '../store/authSlice'
import AuthLayout, { Field, Icon, SuccessMark, submitClass } from '../components/AuthLayout'
import SocialButtons from '../components/SocialButtons'

const RULES = {
  name: (v) => v.trim().length >= 2,
  phone: (v) => /^(\+?84|0)\d{9,10}$/.test(v.replace(/[\s.-]/g, '')),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
  password: (v) => v.length >= 6,
  confirm: (v, f) => v !== '' && v === f.password,
}
const FIELDS = Object.keys(RULES)
const EMPTY = { name: '', phone: '', email: '', password: '', confirm: '' }
const wait = (ms) => new Promise((r) => setTimeout(r, ms)) // mock latency, remove when a real API is used

export default function RegisterPage() {
  const { t } = useT()
  const dispatch = useDispatch()
  const [form, setForm] = useState(EMPTY)
  const [touched, setTouched] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const valid = Object.fromEntries(FIELDS.map((k) => [k, RULES[k](form[k], form)]))
  const count = FIELDS.filter((k) => valid[k]).length
  const pct = Math.round((count / FIELDS.length) * 100)
  const ready = pct === 100

  const errorOf = (k) => {
    if (!touched[k] || valid[k]) return ''
    if (!form[k]) return t.auth.errors.required
    return t.auth.errors[k === 'confirm' ? 'mismatch' : `${k}Invalid`]
  }
  const bind = (k) => ({
    name: k,
    value: form[k],
    valid: valid[k],
    error: errorOf(k),
    onChange: (e) => { setError(''); setForm((f) => ({ ...f, [k]: e.target.value })) },
    onBlur: () => setTouched((s) => ({ ...s, [k]: true })),
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!ready) return setTouched(Object.fromEntries(FIELDS.map((k) => [k, true])))
    setBusy(true)
    try {
      await wait(600)
      await dispatch(register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password })).unwrap()
      setDone(true)
    } catch (code) {
      setError(t.auth.errors[code] ?? t.auth.errors.invalid)
      setBusy(false)
    }
  }

  const onSocial = async (provider) => {
    setBusy(true)
    try {
      await wait(600)
      await dispatch(socialLogin(provider)).unwrap()
      setDone(true)
    } catch (code) {
      setError(t.auth.errors[code] ?? t.auth.errors.invalid)
      setBusy(false)
    }
  }

  if (done) {
    return (
      <AuthLayout title={t.auth.doneTitle} subtitle={t.auth.doneBody} badge={<SuccessMark />}>
        <Link to="/products" className={`${submitClass} mt-8`}>{t.auth.doneCta}<Icon name="arrow" className="size-4" /></Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={t.auth.registerTitle}
      subtitle={t.auth.registerSub}
      footer={<>{t.auth.haveAccount} <Link to="/login" className="font-semibold text-wine-700 underline underline-offset-4">{t.auth.signIn}</Link></>}
    >
      <div className="mt-8">
        <SocialButtons onSelect={onSocial} disabled={busy} />
      </div>

      <form onSubmit={onSubmit} noValidate className="grid gap-4">
        {/* completion progress */}
        <div className="font-sans" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label={t.auth.progress}>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold">
            <span className={`transition-colors ${ready ? 'text-emerald-600' : 'text-navy-900/55'}`}>{ready ? t.auth.ready : t.auth.progress}</span>
            <span className={`tabular-nums transition-colors ${ready ? 'text-emerald-600' : 'text-wine-700'}`}>{pct}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-navy-900/10">
            <div
              className={`relative h-full overflow-hidden rounded-full transition-[width,background-color] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${ready ? 'bg-emerald-500' : 'bg-linear-to-r from-wine-700 to-wine-600'}`}
              style={{ width: `${pct}%` }}
            >
              {pct > 0 && <span aria-hidden="true" className="animate-shimmer absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/45 to-transparent" />}
            </div>
          </div>
        </div>

        <Field label={t.auth.name} star icon="user" placeholder={t.auth.ph.name} autoComplete="name" {...bind('name')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.auth.phone} star icon="phone" type="tel" inputMode="tel" placeholder={t.auth.ph.phone} autoComplete="tel" {...bind('phone')} />
          <Field label={t.auth.email} star icon="mail" type="email" inputMode="email" placeholder={t.auth.ph.email} autoComplete="email" {...bind('email')} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.auth.password} star icon="lock" type="password" placeholder={t.auth.ph.password} autoComplete="new-password" {...bind('password')} />
          <Field label={t.auth.confirm} star icon="lock" type="password" placeholder={t.auth.ph.confirm} autoComplete="new-password" {...bind('confirm')} />
        </div>

        {error && <p role="alert" className="rounded-2xl bg-wine-600/10 px-4 py-3 font-sans text-sm font-medium text-wine-700">{error}</p>}

        <button type="submit" disabled={busy} className={`${submitClass} mt-1`}>
          {busy
            ? <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-chalk/40 border-t-chalk" />
            : <>{t.auth.submitRegister}<Icon name="arrow" className="size-4" /></>}
        </button>
      </form>
    </AuthLayout>
  )
}