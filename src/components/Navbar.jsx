import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router'
import { selectCartCount } from '../store/cartSlice'
import { useT } from '../hooks/useT'
import LangSwitch from './LangSwitch'
import BallMark from './BallMark'
import AuthMenu from './AuthMenu'

function NavItem({ to, onClick, className = '', children }) {
  const base = `transition-colors hover:text-wine-700 ${className}`
  if (to.includes('#')) {
    return <Link to={to} onClick={onClick} className={`${base} text-navy-900/75`}>{children}</Link>
  }
  return (
    <NavLink to={to} end={to === '/'} onClick={onClick} className={({ isActive }) => `${base} ${isActive ? 'font-semibold text-wine-700' : 'text-navy-900/75'}`}>
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { t } = useT()
  const [open, setOpen] = useState(false)
  const count = useSelector(selectCartCount)
  const links = [['/', t.nav.home], ['/products', t.nav.products], ['/#team', t.nav.team], ['#contact', t.nav.contact]]

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-navy-900">
          <BallMark className="size-7 text-wine-700" />
          LDVolley
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(([to, label]) => (
            <li key={to}><NavItem to={to}>{label}</NavItem></li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link to="/cart" aria-label={t.nav.cart} className="hidden rounded-full border border-navy-900/30 px-3 py-1 font-num text-lg sm:block">
            {t.nav.cart}
            <span key={count} className="ml-2 inline-block animate-pop rounded-full bg-wine-700 px-2 text-base text-chalk">{count}</span>
          </Link>
          <div className="hidden lg:block"><AuthMenu /></div>
          <button
            type="button"
            aria-label={t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative grid size-10 place-items-center rounded-full border border-navy-900/30 md:hidden"
          >
            <span className={`block h-0.5 w-5 bg-navy-900 transition-transform ${open ? 'translate-y-1 rotate-45' : '-translate-y-1'}`} />
            <span className={`absolute block h-0.5 w-5 bg-navy-900 transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-navy-900 transition-transform ${open ? '-translate-y-1 -rotate-45' : 'translate-y-1'}`} />
          </button>
        </div>
      </nav>

      {open && (
        <ul className="grid border-t border-navy-900/10 bg-paper px-4 py-3 md:hidden">
          {links.map(([to, label]) => (
            <li key={to}><NavItem to={to} onClick={() => setOpen(false)} className="block py-3 text-lg">{label}</NavItem></li>
          ))}
          <li className="py-3"><Link to="/cart" onClick={() => setOpen(false)} className="font-num text-lg">{t.nav.cart}: {count}</Link></li>
          <li className="py-3"><AuthMenu onNavigate={() => setOpen(false)} /></li>
        </ul>
      )}
    </header>
  )
}
