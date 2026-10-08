import { configureStore } from '@reduxjs/toolkit'
import langReducer from './langSlice'
import cartReducer from './cartSlice'
import filtersReducer from './filtersSlice'
import authReducer from './authSlice'
import productsReducer, { PRODUCTS_KEY } from './productsSlice'

export const store = configureStore({
  reducer: { lang: langReducer, cart: cartReducer, filters: filtersReducer, auth: authReducer, products: productsReducer },
})

// Persist admin product edits (demo storage)
let prev = store.getState().products.items
store.subscribe(() => {
  const cur = store.getState().products.items
  if (cur !== prev) { prev = cur; localStorage.setItem(PRODUCTS_KEY, JSON.stringify(cur)) }
})
