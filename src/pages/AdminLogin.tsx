import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../hooks/auth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')

    const normalizedPhone = phone.trim()
    const normalizedPassword = password.trim()

    if (!normalizedPhone || !normalizedPassword) {
      setError('Fill in phone and password')
      return
    }

    setIsLoading(true)

    try {
      const response = await login(normalizedPhone, normalizedPassword)
      const data = response.data ?? {}

      const accessToken =
        data.accessToken ??
        data.token ??
        data.access_token ??
        ''

      const refreshToken =
        data.refreshToken ??
        data.refresh_token ??
        ''

      const rawRole =
        data.role ??
        data.user?.role ??
        data.user?.userRole ??
        data.user?.roles?.[0] ??
        data.user?.authorities?.[0] ??
        ''

      const normalizedRole = String(rawRole).toUpperCase()
      const isAdmin =
        normalizedRole === 'ADMIN' ||
        normalizedRole === 'SUPER_ADMIN' ||
        data.user?.username === 'admin'

      if (!accessToken) {
        setError('Access token was not returned')
        return
      }

      if (!isAdmin) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('role')
        localStorage.removeItem('user')
        localStorage.removeItem('isAdminAuthenticated')
        setError('У вас нет доступа к админ-панели')
        return
      }

      localStorage.setItem('accessToken', accessToken)

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      localStorage.setItem('role', normalizedRole || 'ADMIN')
      localStorage.setItem('isAdminAuthenticated', 'true')

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      navigate('/admin/home', { replace: true })
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to login'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          padding: 28,
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#111827',
            marginBottom: 8,
          }}
        >
          Admin login
        </div>

        <div
          style={{
            fontSize: 14,
            color: '#6b7280',
            marginBottom: 20,
          }}
        >
          Sign in to access admin pages
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: '12px 14px',
              borderRadius: 8,
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
                color: '#111827',
              }}
            >
              Phone
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone"
              style={{
                width: '100%',
                height: 42,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                padding: '0 12px',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 6,
                color: '#111827',
              }}
            >
              Password
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              style={{
                width: '100%',
                height: 42,
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                padding: '0 12px',
                fontSize: 14,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            style={{
              height: 44,
              border: 'none',
              borderRadius: 8,
              background: '#111111',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              marginTop: 4,
            }}
          >
            {isLoading ? 'Signing in...' : 'Login as admin'}
          </button>
        </div>
      </div>
    </div>
  )
}