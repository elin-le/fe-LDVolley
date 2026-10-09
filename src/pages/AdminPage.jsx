import { useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router'
import { useT } from '../hooks/useT'
import { getOrders } from '../services/orders'
import { hasCancelRequest } from '../utils/orders'
import { Icon } from '../components/AuthLayout'

const NAV = [['analytics', 'chart'], ['orders', 'receipt'], ['products', 'box'], ['users', 'users']]

export default function AdminPage() {
  const { t } = useT()
  const { pathname } = useLocation()
  // badge = orders waiting for the store (pending or asked to cancel); recomputed on every tab change
  const todo = useMemo(() => getOrders().filter((o) => o.status === 'pending' || hasCancelRequest(o)).length, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 font-sans sm:px-6 lg:grid lg:grid-cols-[13.5rem_1fr] lg:gap-8 lg:py-12">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h1 className="animate-rise font-display text-3xl font-extrabold lg:text-4xl">{t.adm.title}</h1>
        <nav className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 lg:pb-0">
          {NAV.map(([k, icon]) => (
            <NavLink key={k} to={`/admin/${k}`}
              className={({ isActive }) => `flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${isActive ? 'bg-navy-900 text-chalk shadow-lg shadow-navy-900/20' : 'text-navy-900/70 hover:bg-navy-900/6'}`}>
              <Icon name={icon} className="size-[18px]" />
              {t.adm.nav[k]}
              {k === 'orders' && todo > 0 && <span className="ml-auto rounded-full bg-wine-600 px-2 py-0.5 text-[11px] font-bold text-white">{todo}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="mt-6 min-w-0 lg:mt-0"><Outlet /></div>
    </section>
  )
}