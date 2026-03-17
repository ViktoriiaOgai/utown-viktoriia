import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getToken, getRole, isAdminRole } from '../hooks/auth'

type ProtectedRouteProps = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getToken()
  const role = getRole()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isAdminRole(role)) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}