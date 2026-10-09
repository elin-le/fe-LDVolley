import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useT } from '../hooks/useT'
import { logout, selectUser } from '../store/authSlice'

const pill = 'rounded-full px-4 py-1.5 font-semibold transition'

export default function AuthMenu({ onNavigate }) {
  const { t } = useT()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  if (!user) {
    return <Link to="/login" onClick={onNavigate} className={`${pill} bg-navy-900 text-chalk hover:bg-wine-700`}>{t.auth.signIn}</Link>
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="hidden text-sm text-navy-900/70 xl:inline">{t.auth.hi}, {user.name.split(' ').pop()}</span>
      <Link to="/orders" onClick={onNavigate} className="text-sm font-semibold text-navy-900/75 transition hover:text-wine-700">{t.ord.myOrders}</Link>
      {user.role === 'admin' && <Link to="/admin" onClick={onNavigate} className={`${pill} bg-wine-700 text-chalk hover:bg-navy-900`}>{t.auth.admin}</Link>}
      <button type="button" onClick={() => { dispatch(logout()); onNavigate?.() }} className={`${pill} border border-navy-900/30 hover:bg-navy-900 hover:text-chalk`}>{t.auth.signOut}</button>
    </div>
  )
}