/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from '../../../../../../components/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { apiFetch } from '../../../../../../services/api'

type CategoryItem = { id: number; name: string }
type PositionOption = { name: string; price: string }

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.data?.content)) return value.data.content
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.result)) return value.result
  return []
}

export default function EstablishmentPositionNewAddPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [putOnHold, setPutOnHold] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('7,000')
  const [category, setCategory] = useState('Select Category')
  const [priority, setPriority] = useState('1')
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [options, setOptions] = useState<PositionOption[]>(Array.from({ length: 7 }, (_, i) => ({ name: `Option ${i + 1}`, price: '3,000' })))

  useEffect(() => {
    apiFetch('/admin/categories')
      .then((data: any) => {
        const list = asArray(data).map((item: any) => ({ id: Number(item?.id ?? 0), name: String(item?.name ?? item?.title ?? '—') }))
        setCategories(list)
      })
      .catch(() => {})
  }, [])

  const inputStyle: React.CSSProperties = { width: '100%', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }
  const labelStyle: React.CSSProperties = { fontSize: 12, color: '#111827', fontWeight: 700, marginBottom: 6 }

  const handleOptionChange = (index: number, key: 'name' | 'price', value: string) => {
    setOptions((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))
  }

  const handleSave = async () => {
    if (!name.trim()) { alert('Enter position name'); return }
    setIsSaving(true)
    try {
      const selectedCategory = categories.find((item) => item.name === category)
      const createdDish = await apiFetch('/admin/dishes', {
        method: 'POST',
        body: JSON.stringify({ restaurantId: Number(id ?? 0), name: name.trim(), description: description.trim(), price, amount: price, category, categoryId: selectedCategory?.id, priority: Number(priority), sortOrder: Number(priority), putOnHold, onHold: putOnHold, isOnHold: putOnHold, blocked: putOnHold }),
      })
      const createdDishId = createdDish?.id ?? createdDish?.dishId ?? createdDish?.data?.id ?? createdDish?.data?.dishId ?? null
      if (createdDishId) {
        await Promise.all(options.filter((item) => item.name.trim() || item.price.trim()).map((item) =>
          apiFetch(`/admin/dishes/${createdDishId}/options`, { method: 'POST', body: JSON.stringify({ name: item.name, price: item.price, amount: item.price }) }).catch(() => null)
        ))
      }
      navigate(`/admin/establishments/${String(id || '')}/positions`)
    } catch (err) {
      console.error(err)
      alert('Failed to add position')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>Add Position</div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#6b7280' }}>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/home')}>Home</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>Users</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/establishments')}>Establishments</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate(`/admin/establishments/${String(id || '')}/positions`)}>Positions</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Add</span>
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 540, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', padding: 22 }}>
              <div style={{ height: 120, borderRadius: 6, border: '1px solid #e5e7eb', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <div style={{ fontSize: 22, color: '#111827' }}>↑</div>
              </div>
              <div style={{ marginBottom: 14 }}><div style={labelStyle}>Position Name</div><input placeholder="Enter name" style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div style={{ marginBottom: 14 }}><div style={labelStyle}>Description</div><textarea placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', minHeight: 92, borderRadius: 4, border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: 13, outline: 'none', resize: 'none', background: '#fff' }} /></div>
              <div style={{ marginBottom: 14 }}><div style={labelStyle}>Price</div><input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} /></div>
              <div style={{ marginBottom: 14 }}>
                <div style={labelStyle}>Category</div>
                <select style={{ ...inputStyle, paddingRight: 10 }} value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option>Select category</option>
                  {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}><div style={labelStyle}>Priority</div><input value={priority} onChange={(e) => setPriority(e.target.value)} style={inputStyle} /></div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ ...labelStyle, marginBottom: 10 }}>Options</div>
                {options.map((option, index) => (
                  <div key={index + 1} style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 8 }}>
                    <input placeholder={`Option ${index + 1}`} style={inputStyle} value={option.name} onChange={(e) => handleOptionChange(index, 'name', e.target.value)} />
                    <input value={option.price} onChange={(e) => handleOptionChange(index, 'price', e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#111827' }}>Put on Hold</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>The dish remains on the menu<br />but is unavailable for order.</div>
                </div>
                <button type="button" onClick={() => setPutOnHold((v) => !v)} style={{ width: 46, height: 24, borderRadius: 999, border: 'none', background: putOnHold ? '#111' : '#e5e7eb', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 999, background: '#fff', position: 'absolute', top: 2, left: putOnHold ? 24 : 2, transition: 'left 150ms ease', boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }} />
                </button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 14 }}>
            <button type="button" onClick={() => navigate(`/admin/establishments/${String(id || '')}/positions`)} style={{ height: 36, minWidth: 140, borderRadius: 4, border: 'none', background: '#f3f4f6', color: '#111', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="button" onClick={handleSave} disabled={isSaving} style={{ height: 36, minWidth: 160, borderRadius: 4, border: 'none', background: '#111', color: '#fff', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Saving...' : 'Add'}</button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}