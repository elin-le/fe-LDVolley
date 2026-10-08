import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { useT } from '../hooks/useT'
import { login, socialLogin } from '../store/authSlice'
import AuthLayout, { Field, Icon, submitClass } from '../components/AuthLayout'
import SocialButtons from '../components/SocialButtons'

export default function LoginPage() {
  const { t } = useT()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const finish = (user) => navigate(user.role === 'admin' ? '/admin' : '/')
  const fail = (code) => { setError(t.auth.errors[code] ?? t.auth.errors.invalid); setBusy(false) }

  const onSubmit = async (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setBusy(true)
    try { finish(await dispatch(login({ email: f.get('email'), password: f.get('password') })).unwrap()) } catch (code) { fail(code) }
  }

  const onSocial = async (provider) => {
    setBusy(true)
    try { finish(await dispatch(socialLogin(provider)).unwrap()) } catch (code) { fail(code) }
  }

  return (
    <AuthLayout
      title={t.auth.loginTitle}
      subtitle={t.auth.loginSub}
      footer={<>{t.auth.noAccount} <Link to="/register" className="font-semibold text-wine-700 underline underline-offset-4">{t.auth.register}</Link></>}
    >
      <div className="mt-8">
        <SocialButtons onSelect={onSocial} disabled={busy} />
      </div>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Field label={t.auth.email} icon="mail" name="email" type="email" placeholder={t.auth.ph.email} autoComplete="email" required />
        <Field label={t.auth.password} icon="lock" name="password" type="password" placeholder={t.auth.ph.loginPassword} autoComplete="current-password" required />
        {error && <p role="alert" className="rounded-2xl bg-wine-600/10 px-4 py-3 font-sans text-sm font-medium text-wine-700">{error}</p>}
        <button type="submit" disabled={busy} className={`${submitClass} mt-1`}>
          {busy
            ? <span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-chalk/40 border-t-chalk" />
            : <>{t.auth.submitLogin}<Icon name="arrow" className="size-4" /></>}
        </button>
      </form>
    </AuthLayout>
  )
}