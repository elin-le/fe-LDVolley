import { Link } from 'react-router'
import { useT } from '../hooks/useT'
import BallMark from './BallMark'
import CountUp from './CountUp'

export default function Hero() {
  const { t } = useT()
  const { stats } = t.hero
  const statList = [[120, '+', stats.products], [48, '', stats.teams], [63, '', stats.shipping]]

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="clip-slash absolute inset-y-0 right-0 -z-10 hidden w-3/5 bg-wine-700 md:block" />
      <div aria-hidden="true" className="clip-slash absolute inset-y-0 right-0 -z-10 hidden w-[52%] bg-navy-900 md:block" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 md:py-24 lg:px-8 lg:py-32">
        <div className="md:col-span-7">
          <h1 className="animate-rise text-5xl font-extrabold leading-[1.05] text-balance sm:text-6xl lg:text-7xl">{t.hero.title}</h1>
          <p className="animate-rise mt-6 max-w-lg text-lg leading-relaxed text-navy-900/75 [animation-delay:150ms]">{t.hero.sub}</p>

          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:300ms]">
            <Link to="/products" className="rounded-full bg-wine-700 px-7 py-3 font-semibold text-chalk transition hover:-translate-y-0.5 hover:bg-navy-900 active:scale-95">{t.hero.cta}</Link>
            <Link to="/#team" className="rounded-full border border-navy-900/40 px-7 py-3 font-semibold transition hover:-translate-y-0.5 hover:bg-navy-900 hover:text-chalk active:scale-95">{t.hero.cta2}</Link>
          </div>

          <dl className="animate-rise mt-12 flex flex-wrap gap-x-10 gap-y-4 [animation-delay:450ms]">
            {statList.map(([num, suffix, label]) => (
              <div key={label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-navy-900/70">{label}</dt>
                <dd className="font-num text-4xl font-semibold leading-none text-wine-700 sm:text-5xl"><CountUp to={num} suffix={suffix} /></dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-ball-in relative rounded-3xl bg-navy-900 p-8 md:col-span-5 md:bg-transparent md:p-0">
          <span aria-hidden="true" className="animate-spin-slow absolute inset-6 rounded-full border-2 border-dashed border-chalk/25 md:inset-2 md:translate-x-6 lg:translate-x-10" />
          <BallMark className="animate-float mx-auto w-2/3 max-w-sm text-chalk md:w-full md:translate-x-6 lg:translate-x-10" />
        </div>
      </div>
    </section>
  )
}
