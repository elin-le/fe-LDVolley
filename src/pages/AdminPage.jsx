import { useState } from 'react'
import { useT } from '../hooks/useT'
import UsersTab from '../components/admin/UsersTab'
import ProductsTab from '../components/admin/ProductsTab'

export default function AdminPage() {
  const { t } = useT()
  const [tab, setTab] = useState('users')
  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="animate-rise text-4xl font-extrabold sm:text-5xl">{t.admin.title}</h1>
      <div role="tablist" className="mt-6 flex gap-2">
        {['users', 'products'].map((k) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`rounded-full border px-5 py-2 font-semibold transition ${tab === k ? 'border-navy-900 bg-navy-900 text-chalk' : 'border-navy-900/25 hover:border-wine-700 hover:text-wine-700'}`}>
            {t.admin[k]}
          </button>
        ))}
      </div>
      <div className="mt-8">{tab === 'users' ? <UsersTab /> : <ProductsTab />}</div>
    </section>
  )
}
