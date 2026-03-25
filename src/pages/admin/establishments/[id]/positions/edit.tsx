/* eslint-disable @typescript-eslint/no-explicit-any */
import MainLayout from '../../../../../components/MainLayout'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../../../../services/api'

type CategoryItem = { id: number; name: string }
type PositionOption = { id?: number; name: string; price: string }

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.data?.content)) return value.data.content
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.result)) return value.result
  return []
}

export default function EditPositionPage() {
  const navigate = useNavigate()
  const { id, positionId } = useParams()
  const establishmentId = id ?? ''
  const [name, setName] = useState('Name')
  const [description, setDescription] = useState('Beef, zucchini, celery, cheese, pepper, cheese edges, etc.')
  const [price, setPrice] = useState('7,000')
  const [category, setCategory] = useState('Select Category')
  const [priority, setPriority] = useState('1')
  const [putOnHold, setPutOnHold] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [options, setOptions] = useState<PositionOption[]>([
    { name: 'Option 1', price: '3,000' }, { name: 'Option 2', price: '3,000' },
    { name: 'Option 3', price: '3,000' }, { name: 'Option 4', price: '3,000' },
    { name: 'Option 5', price: '3,000' }, { name: 'Option 6', price: '3,000' },
    { name: 'Option 7', price: '3,000' },
  ])

  useEffect(() => {
    apiFetch('/admin/categories')
      .then((data: any) => {
        const list = asArray(data).map((item: any) => ({ id: Number(item?.id ?? 0), name: String(item?.name ?? item?.title ?? '—') }))
        setCategories(list)
      })
      .catch(() => {})

    if (!positionId) return

    apiFetch(`/admin/dishes/${positionId}`)
      .then((data: any) => {
        const details = data?.data ?? data
        setName(String(details?.name ?? details?.title ?? 'Name'))
        setDescription(String(details?.description ?? details?.about ?? ''))
        setPrice(String(details?.price ?? details?.amount ?? '7,000'))
        setCategory(String(details?.category ?? details?.categoryName ?? details?.dishCategory ?? 'Select Category'))
        setPriority(String(details?.priority ?? details?.sortOrder ?? '1'))
        setPutOnHold(Boolean(details?.putOnHold ?? details?.onHold ?? details?.isOnHold ?? details?.blocked ?? false))
      })
      .catch(() => {})

    apiFetch(`/admin/dishes/${positionId}/options`)
      .then((data: any) => {
        const list = asArray(data)
        if (!list.length) return
        const nextOptions: PositionOption[] = Array.from({ length: 7 }, (_, index) => {
          const option = list[index]
          if (!option) return { name: `Option ${index + 1}`, price: '3,000' }
          return { id: Number(option?.id ?? option?.optionId ?? 0), name: String(option?.name ?? option?.title ?? `Option ${index + 1}`), price: String(option?.price ?? option?.amount ?? '3,000') }
        })
        setOptions(nextOptions)
      })
      .catch(() => {})
  }, [positionId])

  const selectedCategoryId = useMemo(() => categories.find((item) => item.name === category)?.id, [categories, category])

  const handleOptionChange = (index: number, key: 'name' | 'price', value: string) => {
    setOptions((prev) => prev.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))
  }

  const handleSave = async () => {
    if (!positionId) { alert('Position id not found'); return }
    setIsSaving(true)
    try {
      await apiFetch(`/admin/dishes/${positionId}`, {
        method: 'PUT',
        body: JSON.stringify({ id: Number(positionId), restaurantId: Number(establishmentId), name, description, price, amount: price, category, categoryId: selectedCategoryId, priority: Number(priority), sortOrder: Number(priority), putOnHold, onHold: putOnHold, isOnHold: putOnHold, blocked: putOnHold }),
      })
      await Promise.all(options.filter((item) => item.name.trim() || item.price.trim()).map((item) => {
        if (item.id) return apiFetch(`/admin/dishes/${positionId}/options/${item.id}`, { method: 'PUT', body: JSON.stringify({ id: item.id, name: item.name, price: item.price, amount: item.price }) }).catch(() => null)
        return apiFetch(`/admin/dishes/${positionId}/options`, { method: 'POST', body: JSON.stringify({ name: item.name, price: item.price, amount: item.price }) }).catch(() => null)
      }))
      navigate(`/admin/establishments/${String(establishmentId)}/positions`)
    } catch (err) {
      console.error(err)
      alert('Failed to save position')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>Edit Position</div>
          <div style={{ marginTop: 10, fontSize: 13, color: '#6b7280' }}>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/home')}>Home</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>Users</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/establishments')}>Establishments</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)}>Positions</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff' }}>Position Name</span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Edit</span>
          </div>
          <div style={{ marginTop: 18, width: 'min(760px, 100%)', border: '1px solid #e5e7eb', borderRadius: 10, padding: 28, background: '#fff', marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', marginBottom: 22 }}>
              <div style={{ display: 'flex', height: 150 }}>
                <div style={{ width: 170, background: '#f0f0f0', display: 'grid', placeItems: 'center', color: '#111827', fontSize: 26 }}>↑</div>
                <div style={{ flex: 1, background: '#f7f7f7' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 18 }}>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Position Name</div><input value={name} onChange={(e) => setName(e.target.value)} style={{ width: 'min(360px, 100%)', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} /></div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Description</div><textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: 'min(360px, 100%)', height: 90, borderRadius: 4, border: '1px solid #cbd5e1', padding: '10px 12px', fontSize: 13, outline: 'none', background: '#fff', resize: 'none' }} /></div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Price</div><input value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: 'min(360px, 100%)', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} /></div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Category</div>
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 'min(360px, 100%)', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }}>
                  <option>Select Category</option>
                  {categories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                </select>
              </div>
              <div><div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Priority</div><input value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: 'min(360px, 100%)', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} /></div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', marginBottom: 10 }}>Options</div>
                <div style={{ display: 'grid', gap: 8, width: 'min(360px, 100%)' }}>
                  {options.map((item, index) => (
                    <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: 8 }}>
                      <input value={item.name} onChange={(e) => handleOptionChange(index, 'name', e.target.value)} style={{ height: 30, borderRadius: 3, border: '1px solid #cbd5e1', padding: '0 10px', fontSize: 12 }} />
                      <input value={item.price} onChange={(e) => handleOptionChange(index, 'price', e.target.value)} style={{ height: 30, borderRadius: 3, border: '1px solid #cbd5e1', padding: '0 10px', fontSize: 12 }} />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Put on Hold</div>
                <button type="button" onClick={() => setPutOnHold((v) => !v)} style={{ width: 46, height: 24, borderRadius: 999, border: 'none', background: putOnHold ? '#111' : '#e5e7eb', position: 'relative', cursor: 'pointer', padding: 0 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 999, background: '#fff', position: 'absolute', top: 2, left: putOnHold ? 24 : 2, boxShadow: '0 1px 2px rgba(0,0,0,0.15)', transition: 'left 160ms ease' }} />
                </button>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: -10 }}>The dish remains on the menu <br />but is unavailable for order.</div>
            </div>
          </div>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button type="button" onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)} style={{ height: 40, minWidth: 180, borderRadius: 2, border: 'none', background: '#efefef', color: '#111', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            <button type="button" onClick={handleSave} disabled={isSaving} style={{ height: 40, minWidth: 180, borderRadius: 2, border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.7 : 1 }}>{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}