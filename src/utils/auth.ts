export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export function getToken() {
  return (
    localStorage.getItem('token') ||
    getStoredUser()?.token ||
    ''
  )
}

export function getRole() {
  return (
    localStorage.getItem('role') ||
    getStoredUser()?.role ||
    ''
  )
}

export function saveAuth(data: any) {
  const token = data?.token ?? data?.accessToken ?? ''
  const role =
    data?.role ??
    data?.user?.role ??
    data?.authorities?.[0] ??
    ''

  if (token) {
    localStorage.setItem('token', token)
  }

  if (role) {
    localStorage.setItem('role', String(role))
  }

  localStorage.setItem('user', JSON.stringify(data))
}

export function clearAuth() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
}

export function isAdminRole(role: string) {
  const normalized = String(role || '').toUpperCase()
  return (
    normalized === 'ADMIN' ||
    normalized === 'ROLE_ADMIN' ||
    normalized === 'SUPER_ADMIN' ||
    normalized === 'ROLE_SUPER_ADMIN'
  )
}