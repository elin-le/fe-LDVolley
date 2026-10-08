import { createSlice } from '@reduxjs/toolkit'

const saved = typeof localStorage !== 'undefined' && localStorage.getItem('ldv-lang')

const langSlice = createSlice({
  name: 'lang',
  initialState: { current: saved || 'vi' },
  reducers: {
    setLang(state, { payload }) {
      state.current = payload
      localStorage.setItem('ldv-lang', payload)
      document.documentElement.lang = payload
    },
  },
})

export const { setLang } = langSlice.actions
export default langSlice.reducer
