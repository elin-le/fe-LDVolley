import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { useT } from '../../hooks/useT'
import { clearDemo, getOrders, seedDemo } from '../../services/orders'
import { hasCancelRequest } from '../../utils/orders'
import { PERIODS, categoryMix, delta, kpis, rangeOf, soldIn, topCustomers, topProducts, trend, vipMap } from '../../utils/analytics'
import { compactVnd, vnd } from '../../utils/pricing'
import { AreaLine, Donut, HBars, StackedBars } from '../charts'
import { Icon } from '../AuthLayout'
import { VipBadge } from '../OrderStatus'

const CAT_COLORS = [
  ['stroke-wine-700', 'bg-wine-700'], ['stroke-navy-800', 'bg-navy-800'], ['stroke-amber-500', 'bg-amber-500'], ['stroke-emerald-500', 'bg-emerald-500'],
]

function Card({ title, sub, right, className = '', children }) {
  return (
    <section className={`rounded-3xl bg-white p-5 shadow-[0_10px_40px_-26px_rgba(11,27,58,.4)] ring-1 ring-navy-900/8 sm:p-6 ${className}`}>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-bold">{title}</h3>
          {sub && <p className="mt-0.5 text-xs text-navy-900/55">{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  )
}

function Segmented({ value, onChange, options }) {
  return (
    <div role="tablist" className="inline-flex rounded-full bg-navy-900/[0.06] p-1">
      {options.map(([k, label]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} onClick={() => onChange(k)}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${value === k ? 'bg-white shadow-sm' : 'text-navy-900/60 hover:text-navy-900'}`}>{label}</button>
      ))}
    </div>
  )
}

function Kpi({ label, value, d, vs }) {
  const up = d != null && d >= 0
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_-26px_rgba(11,27,58,.4)] ring-1 ring-navy-900/8">
      <p className="text-sm text-navy-900/60">{label}</p>
      <p className="mt-1 font-num text-4xl leading-none tracking-wide">{value}</p>
      <p className="mt-3 flex items-center gap-1.5 text-xs">
        {d == null ? <span className="text-navy-900/40">–</span> : (
          <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-bold ${up ? 'bg-emerald-100 text-emerald-800' : 'bg-wine-700/10 text-wine-700'}`}>
            <Icon name="arrow" className={`size-3 ${up ? '-rotate-90' : 'rotate-90'}`} />{Math.abs(Math.round(d))}%
          </span>
        )}
        <span className="text-navy-900/50">{vs}</span>
      </p>
    </div>
  )
}

export default function AnalyticsTab() {
  const { t, lang } = useT()
  const a = t.adm.a
  const products = useSelector((s) => s.products.items)
  const [orders, setOrders] = useState(getOrders)
  const [period, setPeriod] = useState('month')
  const [seg, setSeg] = useState('all')
  const now = useMemo(() => new Date(), [])

  const cur = useMemo(() => soldIn(orders, rangeOf(period, 0, now)), [orders, period, now])
  const prev = useMemo(() => soldIn(orders, rangeOf(period, -1, now)), [orders, period, now])
  const series = useMemo(() => trend(orders, period, now), [orders, period, now])
  const vips = useMemo(() => vipMap(orders, now), [orders, now])
  const k = kpis(cur), kp = kpis(prev)
  const unit = a.unit[period]
  const pending = orders.filter((o) => o.status === 'pending').length
  const cancelReqs = orders.filter(hasCancelRequest).length
  const hasDemo = orders.some((o) => o.demo)

  const tops = topProducts(cur)
  const cats = categoryMix(cur)
  const custs = topCustomers(cur, seg).slice(0, 6)
  const cname = (id) => t.categories.items[id]?.[0] ?? id
  const money = (v) => compactVnd(v, lang)

  if (!orders.length) {
    return (
      <div className="grid place-items-center rounded-3xl bg-white p-12 text-center ring-1 ring-navy-900/8">
        <span className="grid size-16 place-items-center rounded-full bg-wine-700/10 text-wine-700"><Icon name="chart" className="size-8" /></span>
        <p className="mt-4 max-w-sm text-lg font-semibold">{a.seedHint}</p>
        <button type="button" onClick={() => setOrders(seedDemo(products))} className="mt-5 rounded-2xl bg-linear-to-r from-wine-700 to-wine-600 px-7 py-3 text-sm font-semibold text-chalk shadow-lg shadow-wine-700/25">{a.seed}</button>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold">{a.title}</h2>
          <p className="mt-1 text-sm text-navy-900/60">{a.note}</p>
        </div>
        <Segmented value={period} onChange={setPeriod} options={PERIODS.map((p) => [p, a.period[p]])} />
      </div>

      {(pending > 0 || cancelReqs > 0) && (
        <Link to="/admin/orders" className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-amber-50 px-5 py-3 text-sm font-semibold text-amber-900 ring-1 ring-amber-300/60 transition hover:bg-amber-100">
          <Icon name="clock" className="size-5" />
          {pending > 0 && <span>{a.todo.replace('{n}', pending)}</span>}
          {cancelReqs > 0 && <span className="text-wine-700">{a.todoCancel.replace('{n}', cancelReqs)}</span>}
          <span className="ml-auto underline underline-offset-4">{a.handle}</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label={a.kpi.revenue} value={vnd.format(k.revenue)} d={delta(k.revenue, kp.revenue)} vs={a.vsPrev} />
        <Kpi label={a.kpi.orders} value={k.count} d={delta(k.count, kp.count)} vs={a.vsPrev} />
        <Kpi label={a.kpi.aov} value={vnd.format(k.aov)} d={delta(k.aov, kp.aov)} vs={a.vsPrev} />
        <Kpi label={a.kpi.ws} value={`${Math.round(k.wsShare * 100)}%`} d={delta(k.wsShare, kp.wsShare)} vs={a.vsPrev} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="grid min-w-0 gap-5">
          <Card title={a.ordersTrend.replace('{p}', unit)}
            right={<div className="flex gap-4 text-xs font-semibold"><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-wine-700" />{a.retail}</span><span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-navy-800" />{a.wholesale}</span></div>}>
            <StackedBars key={period} data={series.map((s) => ({ label: s.label, parts: [s.retail, s.wholesale] }))} names={[a.retail, a.wholesale]} fills={['fill-wine-700', 'fill-navy-800']} />
          </Card>
          <Card title={a.revenueTrend.replace('{p}', unit)}>
            <AreaLine key={period} data={series.map((s) => ({ label: s.label, value: s.revenue }))} format={(v) => vnd.format(v)} short={money} name={a.revenueTrend.replace('{p}', unit)} />
          </Card>
        </div>

        <div className="grid content-start gap-5">
          <Card title={a.mix}>
            <Donut format={money} slices={[{ label: a.retail, value: k.revenue - k.wsRevenue, stroke: 'stroke-wine-700', bg: 'bg-wine-700' }, { label: a.wholesale, value: k.wsRevenue, stroke: 'stroke-navy-800', bg: 'bg-navy-800' }]}
              center={<><span className="font-num text-2xl leading-none">{money(k.revenue)}</span><span className="mt-1 text-[11px] text-navy-900/50">{a.period[period]}</span></>} />
          </Card>
          <Card title={a.byCat}>
            {cats.length ? <Donut format={money} slices={cats.map((c, i) => ({ label: cname(c.id), value: c.value, stroke: CAT_COLORS[i % 4][0], bg: CAT_COLORS[i % 4][1] }))} center={<span className="font-num text-2xl leading-none">{cats.length}</span>} /> : <p className="py-6 text-center text-sm text-navy-900/50">{a.empty}</p>}
          </Card>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title={a.topProducts} sub={a.period[period]}>
          {tops.length ? <HBars items={tops.map((p) => ({ label: p.name[lang], value: p.qty, right: `${p.qty} ${a.pcs} ${a.sold}`, sub: vnd.format(p.revenue) }))} /> : <p className="py-8 text-center text-sm text-navy-900/50">{a.empty}</p>}
        </Card>

        <Card title={a.topCustomers} sub={a.vipRule}
          right={<Segmented value={seg} onChange={setSeg} options={[['all', a.all], ['wholesale', a.wholesale], ['retail', a.retail]]} />}>
          {custs.length ? (
            <ol className="grid gap-3">
              {custs.map((c, i) => {
                const isVip = i === 0 && seg !== 'all'
                const myVips = (vips[c.id] ?? []).filter((v) => v.period === period && (seg === 'all' || v.seg === seg))
                return (
                  <li key={c.id} className="flex items-center gap-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-800 ring-1 ring-amber-300' : 'bg-navy-900/[0.06] text-navy-900/60'}`}>
                      {i === 0 ? <Icon name="crown" className="size-4" /> : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        <span className="truncate">{c.name}</span>
                        {(isVip || myVips.length > 0) && <VipBadge label={a.vip} />}
                        {c.ws > 0 && seg === 'all' && <span className="rounded-full bg-navy-900 px-2 py-0.5 text-[11px] font-semibold text-chalk">{a.wholesale}</span>}
                      </p>
                      <p className="text-xs text-navy-900/55">{c.orders} {a.orders}</p>
                    </div>
                    <p className="font-num text-lg text-wine-700">{vnd.format(c.revenue)}</p>
                  </li>
                )
              })}
            </ol>
          ) : <p className="py-8 text-center text-sm text-navy-900/50">{a.empty}</p>}
        </Card>
      </div>

      <div className="flex justify-end">
        {hasDemo
          ? <button type="button" onClick={() => setOrders(clearDemo())} className="text-sm font-semibold text-navy-900/60 underline underline-offset-4 hover:text-wine-700">{a.clear}</button>
          : <button type="button" onClick={() => setOrders(seedDemo(products))} className="text-sm font-semibold text-navy-900/60 underline underline-offset-4 hover:text-wine-700">{a.seed}</button>}
      </div>
    </div>
  )
}