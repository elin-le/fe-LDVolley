import { createSlice } from '@reduxjs/toolkit'

const initialState = { query: '', category: 'all', sort: 0, price: 0 }

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setQuery: (s, { payload }) => { s.query = payload },
    setCategory: (s, { payload }) => { s.category = payload },
    setSort: (s, { payload }) => { s.sort = payload },
    setPrice: (s, { payload }) => { s.price = payload },
    resetFilters: () => initialState,
  },
})

export const { setQuery, setCategory, setSort, setPrice, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer
