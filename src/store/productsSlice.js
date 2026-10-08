import { createSlice } from '@reduxjs/toolkit'
import { products as seed } from '../data/products'

export const PRODUCTS_KEY = 'ldv-products'

const load = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PRODUCTS_KEY)) ?? []
    return seed.map((p) => ({ ...p, ...saved.find((s) => s.id === p.id) }))
  } catch { return seed }
}

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: load() },
  reducers: {
    updateProduct(state, { payload }) {
      const i = state.items.findIndex((p) => p.id === payload.id)
      if (i >= 0) state.items[i] = { ...state.items[i], ...payload }
    },
  },
})

export const { updateProduct } = productsSlice.actions
export default productsSlice.reducer
