import { Link } from 'react-router'
import { useT } from '../hooks/useT'
import { useSelector } from 'react-redux'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

const offsets = ['', 'lg:mt-12', 'lg:mt-4', 'lg:mt-16']
const delays = ['', 'delay-100', 'delay-200', 'delay-300']

export default function FeaturedProducts() {
  const { t } = useT()
  const products = useSelector((s) => s.products.items)
  return (
    <section id="shop" className="scroll-mt-16 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl font-extrabold sm:text-5xl">{t.products.title}</h2>
          <Link to="/products" className="font-num text-xl font-semibold text-wine-700 underline underline-offset-4">{t.products.viewAll}</Link>
        </Reveal>
        <div className="mt-12 grid grid-cols-1 gap-8 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} className={delays[i]}><ProductCard product={p} className={offsets[i]} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
