import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: {} }, // { [productId]: quantity }
  reducers: {
    addToCart(state, { payload: { id, qty = 1 } }) {
      state.items[id] = (state.items[id] ?? 0) + qty
    },
    removeFromCart(state, { payload: id }) {
      delete state.items[id]
    },
    setQty(state, { payload: { id, qty } }) {
      if (qty < 1) delete state.items[id]
      else state.items[id] = qty
    },
    clearCart(state) { state.items = {} },
  },
})

export const { addToCart, removeFromCart, setQty, clearCart } = cartSlice.actions
export const selectCartCount = (s) => Object.values(s.cart.items).reduce((a, b) => a + b, 0)
export default cartSlice.reducer