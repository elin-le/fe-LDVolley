export const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

// Wholesale price applies only to approved accounts and once the minimum quantity is reached
export const unitPrice = (product, qty, wholesale) => (wholesale && qty >= product.minQty ? product.wholesale : product.price)
