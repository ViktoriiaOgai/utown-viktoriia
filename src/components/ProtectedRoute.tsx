import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { getToken, getRole, isAdminRole } from '../utils/auth'

type Props = {
  children: ReactNode
  requireAdmin?: boolean
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: Props) {
  const token = getToken()
  const role = getRole()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && !isAdminRole(role)) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}