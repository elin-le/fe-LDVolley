import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getSessionUser, loginUser, registerUser, setSession, socialLogin as socialLoginUser } from '../services/mockDb'

const pub = (u) => (u ? (({ password, ...rest }) => rest)(u) : null) // never keep the password in state

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try { return pub(loginUser(email, password)) } catch (e) { return rejectWithValue(e.message) }
})
export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try { return pub(registerUser(data)) } catch (e) { return rejectWithValue(e.message) }
})
export const socialLogin = createAsyncThunk('auth/social', async (provider, { rejectWithValue }) => {
  try { return pub(socialLoginUser(provider)) } catch (e) { return rejectWithValue(e.message) }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: pub(getSessionUser()) },
  reducers: {
    logout(state) { state.user = null; setSession(null) },
  },
  extraReducers: (b) => {
    b.addCase(login.fulfilled, (s, { payload }) => { s.user = payload })
    b.addCase(register.fulfilled, (s, { payload }) => { s.user = payload })
    b.addCase(socialLogin.fulfilled, (s, { payload }) => { s.user = payload })
  },
})

export const { logout } = authSlice.actions
export const selectUser = (s) => s.auth.user
// Wholesale prices are visible only to admin-approved ("active") accounts
export const selectIsWholesale = (s) => s.auth.user?.status === 'active'
export default authSlice.reducer