import { useSelector } from 'react-redux'
import { selectIsWholesale } from '../store/authSlice'
import { useT } from '../hooks/useT'
import { vnd } from '../utils/pricing'

// Approved accounts see the wholesale price with the retail price struck through
export default function PriceTag({ product, size = 'text-2xl' }) {
  const { t } = useT()
  const wholesale = useSelector(selectIsWholesale)
  if (!wholesale) return <p className={`font-num font-semibold tracking-wide text-wine-700 ${size}`}>{vnd.format(product.price)}</p>
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 font-num font-semibold">
      <span className={`text-wine-700 ${size}`}>{vnd.format(product.wholesale)}</span>
      <span className="text-lg text-navy-900/50 line-through">{vnd.format(product.price)}</span>
      <span className="rounded-full bg-navy-900 px-2 text-sm text-chalk">{t.ws.badge}</span>
    </p>
  )
}
