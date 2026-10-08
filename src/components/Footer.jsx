import { useT } from '../hooks/useT'

export default function Footer() {
  const { t } = useT()
  const { links } = t.footer
  return (
    <footer id="contact" className="scroll-mt-16 border-t border-white/10 bg-navy-900 text-chalk">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-6">
          <p className="text-3xl font-extrabold">LDVolley</p>
          <p className="mt-3 max-w-sm text-chalk/70">{t.footer.about}</p>
        </div>
        <nav className="md:col-span-3" aria-label={t.footer.shop}>
          <h3 className="font-semibold">{t.footer.shop}</h3>
          <ul className="mt-3 grid gap-2 text-chalk/70">
            {Object.values(t.categories.items).map(([name]) => (
              <li key={name}><a href="#shop" className="hover:text-chalk">{name}</a></li>
            ))}
          </ul>
        </nav>
        <nav className="md:col-span-3" aria-label={t.footer.support}>
          <h3 className="font-semibold">{t.footer.support}</h3>
          <ul className="mt-3 grid gap-2 text-chalk/70">
            {Object.entries(links).map(([k, label]) => (
              <li key={k}><a href="#contact" className="hover:text-chalk">{label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/10 py-5 text-center font-num text-lg text-chalk/60">
        © {new Date().getFullYear()} LDVolley. {t.footer.rights}
      </p>
    </footer>
  )
}
