import MainLayout from '../../../../../../components/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
<<<<<<< HEAD
import { apiFetch } from '../../../../../../services/api'
=======
import { api } from '../../../../../../services/api'
import '../../../../../../styles/categories.scss'
>>>>>>> 50d84bf (fix: fix scss import path in add.tsx)

export default function AddCategoryPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const establishmentId = id ?? ''

  const [name, setName] = useState('')
  const [priority, setPriority] = useState('1')
  const [isSaving, setIsSaving] = useState(false)

  const handleAdd = async () => {
    if (!name.trim()) { alert('Enter category name'); return }
    setIsSaving(true)
    try {
      await apiFetch('/admin/categories', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), priority: Number(priority), sortOrder: Number(priority), restaurantId: Number(establishmentId) }),
      })
      navigate(`/admin/establishments/${String(establishmentId)}/positions/categories`)
    } catch (err) {
      console.error(err)
      alert('Failed to add category')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>Add Category</div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#6b7280' }}>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/home')}>Home</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>Users</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/establishments')}>Establishments</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)}>Positions</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Add Category</span>
          </div>

          <div style={{ marginTop: 18, width: 'min(760px, 100%)', border: '1px solid #e5e7eb', borderRadius: 10, padding: 28, background: '#fff', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 22 }}>
              <div style={{ display: 'flex', height: 150 }}>
                <div style={{ width: 170, background: '#f0f0f0', display: 'grid', placeItems: 'center', color: '#111827', fontSize: 26 }}>↑</div>
                <div style={{ flex: 1, background: '#f7f7f7' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 18 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Category Name</div>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" style={{ width: 'min(360px, 100%)', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Priority</div>
                <input value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: 'min(360px, 100%)', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button type="button" onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)} style={{ height: 40, minWidth: 180, borderRadius: 2, border: 'none', background: '#efefef', color: '#111', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="button" onClick={handleAdd} disabled={isSaving} style={{ height: 40, minWidth: 180, borderRadius: 2, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Saving...' : 'Add'}</button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}