import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const location = useLocation()
  const token = typeof window !== 'undefined' ? localStorage.getItem('aw_auth') : null
  if (!token) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  }
  return <>{children}</>
}


