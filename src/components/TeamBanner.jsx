import { useT } from '../hooks/useT'
import Reveal from './Reveal'
import BallMark from './BallMark'

export default function TeamBanner() {
  const { t } = useT()
  return (
    <section id="team" className="relative isolate scroll-mt-16 overflow-hidden py-24 text-chalk">
      <div aria-hidden="true" className="clip-slash-r absolute inset-y-0 left-0 -z-10 w-full bg-wine-700 md:w-4/5" />
      <BallMark className="animate-spin-slow absolute -right-16 top-1/2 -z-10 hidden size-96 -translate-y-1/2 text-navy-900/15 md:block" />
      <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="max-w-2xl text-4xl font-extrabold leading-tight text-balance sm:text-5xl">{t.team.title}</h2>
        <p className="mt-5 max-w-xl text-lg text-chalk/85">{t.team.body}</p>
        <a href="#contact" className="mt-8 inline-block rounded-full bg-chalk px-7 py-3 font-semibold text-navy-900 transition hover:-translate-y-0.5 hover:bg-wine-300 active:scale-95">{t.team.cta}</a>
      </Reveal>
    </section>
  )
}
