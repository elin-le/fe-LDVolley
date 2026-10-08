import { Link } from 'react-router'
import { useT } from '../hooks/useT'
import { categoryImages } from '../data/categories'
import Reveal from './Reveal'

// [key, grid span, scroll-in direction, overlay tint]
const layout = [
  ['balls', 'md:col-span-7 md:min-h-80', 'left', 'from-wine-700/90 via-wine-700/30'],
  ['shoes', 'md:col-span-5 md:min-h-60 md:self-end', 'right', 'from-navy-900/90 via-navy-900/30'],
  ['pads', 'md:col-span-5 md:min-h-60 md:self-start', 'left', 'from-navy-900/90 via-navy-900/30'],
  ['apparel', 'md:col-span-7 md:min-h-80', 'right', 'from-wine-700/90 via-wine-700/30'],
]

export default function Categories() {
  const { t } = useT()
  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-16 px-4 py-20 sm:px-6 lg:px-8">
      <Reveal as="h2" className="max-w-xl text-4xl font-extrabold text-balance sm:text-5xl">{t.categories.title}</Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-12">
        {layout.map(([key, span, from, tint]) => {
          const [name, desc] = t.categories.items[key]
          return (
            <Reveal key={key} from={from} className={span}>
              <Link to={`/products?cat=${key}`} className="group relative isolate flex h-full min-h-64 flex-col justify-end overflow-hidden rounded-3xl bg-navy-900 p-6 text-chalk transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl sm:p-8">
                <div aria-hidden="true" className="absolute inset-0 -z-20 scale-125 transition-transform duration-[1600ms] ease-out in-data-[shown=true]:scale-100">
                  <img src={categoryImages[key]} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <span aria-hidden="true" className={`absolute inset-0 -z-10 bg-linear-to-t to-transparent ${tint}`} />
                <div className="translate-y-6 opacity-0 transition duration-700 delay-300 in-data-[shown=true]:translate-y-0 in-data-[shown=true]:opacity-100">
                  <h3 className="text-3xl font-semibold">{name}</h3>
                  <p className="mt-2 max-w-sm text-chalk/85">{desc}</p>
                  <span className="mt-4 inline-block border-b border-chalk font-num text-lg transition-all group-hover:pr-4">{t.categories.view}</span>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
