export const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

// Wholesale price applies only to approved accounts and once the minimum quantity is reached
export const unitPrice = (product, qty, wholesale) => (wholesale && qty >= product.minQty ? product.wholesale : product.price)


export const compactVnd = (v, lang = 'vi') => {
  const u = lang === 'vi' ? ['k', 'tr', 'tỷ'] : ['k', 'M', 'B']
  const f = (n) => String(Math.round(n * 10) / 10)
  return v >= 1e9 ? f(v / 1e9) + u[2] : v >= 1e6 ? f(v / 1e6) + u[1] : v >= 1e3 ? f(v / 1e3) + u[0] : String(Math.round(v))
}

// Order lines snapshot the applied price, so later price edits never change old orders
export const buildLines = (rows, wholesale) => rows.map(({ p, qty }) => {
  const isWholesale = Boolean(wholesale) && qty >= p.minQty
  return {
    id: p.id, name: p.name, image: p.images.find(Boolean) ?? '', category: p.category, qty,
    price: isWholesale ? p.wholesale : p.price, retail: p.price, wholesale: p.wholesale, minQty: p.minQty, isWholesale,
  }
})
export const sumLines = (lines) => lines.reduce((s, l) => s + l.price * l.qty, 0)