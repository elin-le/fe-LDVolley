const USERS = 'ldv-users'
const SESSION = 'ldv-session'
const seed = [{ id: 'u-admin', name: 'Admin', email: 'admin@ldvolley.com', phone: '', password: 'admin123', role: 'admin', status: 'active' }]

export const getUsers = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS))
    if (saved) return saved
  } catch { /* fall through to seed */ }
  localStorage.setItem(USERS, JSON.stringify(seed))
  return seed
}
const saveUsers = (users) => localStorage.setItem(USERS, JSON.stringify(users))
export const setSession = (id) => (id ? localStorage.setItem(SESSION, id) : localStorage.removeItem(SESSION))

export const getSessionUser = () => {
  const user = getUsers().find((u) => u.id === localStorage.getItem(SESSION))
  return user && user.status !== 'blocked' ? user : null
}

export function registerUser({ name, email, phone, password }) {
  const users = getUsers()
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('emailTaken')
  const user = { id: `u-${Date.now()}`, name, email, phone, password, role: 'customer', status: 'pending' }
  saveUsers([...users, user])
  setSession(user.id)
  return user
}

export function loginUser(email, password) {
  const user = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (!user) throw new Error('invalid')
  if (user.status === 'blocked') throw new Error('blocked')
  setSession(user.id)
  return user
}

export function setUserStatus(id, status) {
  const next = getUsers().map((u) => (u.id === id ? { ...u, status } : u))
  saveUsers(next)
  return next
}


// MOCK social sign-in. Replace with a real OAuth flow (see notes) that returns the provider profile.
export function socialLogin(provider) {
  const users = getUsers()
  const email = `${provider}.user@demo.ldvolley`
  let user = users.find((u) => u.email === email)
  if (!user) {
    user = { id: `u-${Date.now()}`, name: provider === 'google' ? 'Google User' : 'Facebook User', email, phone: '', password: null, role: 'customer', status: 'pending', provider }
    saveUsers([...users, user])
  }
  if (user.status === 'blocked') throw new Error('blocked')
  setSession(user.id)
  return user
}