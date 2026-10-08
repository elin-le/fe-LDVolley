import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { selectUser } from '../store/authSlice'

export default function RequireAdmin({ children }) {
  const user = useSelector(selectUser)
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'admin' ? children : <Navigate to="/" replace />
}
