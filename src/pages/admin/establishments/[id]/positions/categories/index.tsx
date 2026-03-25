/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import MainLayout from '../../../../../../components/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { apiFetch } from '../../../../../../services/api'

type CategoryRow = { id: number; name: string; priority: number; establishmentId?: number }

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.data?.content)) return value.data.content
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.result)) return value.result
  return []
}

function normalizeCategory(item: any): CategoryRow {
  return {
    id: Number(item?.id ?? item?.categoryId ?? item?.category_id ?? 0),
    name: String(item?.name ?? item?.title ?? '—'),
    priority: Number(item?.priority ?? item?.sortOrder ?? 1),
    establishmentId: Number(item?.restaurantId ?? item?.establishmentId ?? item?.restaurant_id ?? 0),
  }
}

export default function EstablishmentCategoriesPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const establishmentId = id ?? ''
  const pageSize = 6
  const [allItems, setAllItems] = useState<CategoryRow[]>([])
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('Choose action')
  const [hoverAddPos, setHoverAddPos] = useState(false)
  const [hoverAddCat, setHoverAddCat] = useState(false)
  const [savingId, setSavingId] = useState<number | null>(null)

  useEffect(() => {
    apiFetch('/admin/categories')
      .then((data: any) => {
        const list = asArray(data).map(normalizeCategory)
        setAllItems(list.filter((item) => !item.establishmentId || String(item.establishmentId) === String(establishmentId)))
      })
      .catch(() => { setAllItems([]) })
  }, [establishmentId])

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase()
    if (!value) return allItems
    return allItems.filter((item) => item.name.toLowerCase().includes(value))
  }, [allItems, search])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredItems.length / pageSize)), [filteredItems.length])
  const pageItems = useMemo(() => filteredItems.slice((page - 1) * pageSize, page * pageSize), [filteredItems, page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))
  const prevDisabled = page <= 1
  const nextDisabled = page >= totalPages
  const buttonBase: React.CSSProperties = { padding: '8px 12px', border: 'none', background: '#fff', color: '#111', cursor: 'pointer' }
  const allChecked = pageItems.length > 0 && pageItems.every((item) => selectedIds.includes(item.id))

  const toggleOne = (categoryId: number) => setSelectedIds((prev) => prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId])
  const toggleAll = () => {
    if (allChecked) { setSelectedIds((prev) => prev.filter((id) => !pageItems.some((item) => item.id === id))); return }
    setSelectedIds((prev) => { const next = [...prev]; pageItems.forEach((item) => { if (!next.includes(item.id)) next.push(item.id) }); return next })
  }

  const handlePriorityChange = (categoryId: number, value: string) => setAllItems((prev) => prev.map((item) => item.id === categoryId ? { ...item, priority: Number(value || 0) } : item))

  const handlePrioritySave = async (item: CategoryRow) => {
    setSavingId(item.id)
    try {
      await apiFetch(`/admin/categories/${item.id}`, { method: 'PUT', body: JSON.stringify({ id: item.id, name: item.name, priority: item.priority, sortOrder: item.priority, restaurantId: Number(establishmentId) }) })
    } catch (err) { console.error(err); alert('Failed to save category priority') } finally { setSavingId(null) }
  }

  const handleEdit = async (item: CategoryRow) => {
    const nextName = window.prompt('Edit category name', item.name)
    if (nextName === null || !nextName.trim()) return
    setSavingId(item.id)
    try {
      await apiFetch(`/admin/categories/${item.id}`, { method: 'PUT', body: JSON.stringify({ id: item.id, name: nextName.trim(), priority: item.priority, sortOrder: item.priority, restaurantId: Number(establishmentId) }) })
      setAllItems((prev) => prev.map((category) => category.id === item.id ? { ...category, name: nextName.trim() } : category))
    } catch (err) { console.error(err); alert('Failed to save category') } finally { setSavingId(null) }
  }

  const handleApply = async () => {
    if (action !== 'Delete' || selectedIds.length === 0) return
    try {
      await Promise.all(selectedIds.map((categoryId) => apiFetch(`/admin/categories/${categoryId}`, { method: 'DELETE' }).catch(() => null)))
      setAllItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
      setSelectedIds([])
    } catch (err) { console.error(err); alert('Failed to delete categories') }
  }

  return (
    <MainLayout>
      <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 26, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>Categories</div>
              <button type="button" onClick={() => { if (!establishmentId) return; navigate(`/admin/establishments/${String(establishmentId)}/positions/add`) }} onMouseEnter={() => setHoverAddPos(true)} onMouseLeave={() => setHoverAddPos(false)} style={{ border: 'none', background: 'transparent', color: hoverAddPos ? '#3b82f6' : '#9ca3af', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>⊕</span> Add position
              </button>
              <button type="button" onClick={() => { if (!establishmentId) return; navigate(`/admin/establishments/${String(establishmentId)}/positions/categories/add`) }} onMouseEnter={() => setHoverAddCat(true)} onMouseLeave={() => setHoverAddCat(false)} style={{ border: 'none', background: 'transparent', color: hoverAddCat ? '#3b82f6' : '#9ca3af', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, padding: 0 }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>⊕</span> Add category
              </button>
            </div>
            <input placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} style={{ width: 460, maxWidth: '100%', height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} />
          </div>
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/home')}>Home</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/profile')}>Users</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/admin/establishments')}>Establishments</span>
              <span style={{ margin: '0 8px' }}>/</span>
              <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate(`/admin/establishments/${String(establishmentId)}/positions`)}>Positions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <select style={{ height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff', width: 190 }} defaultValue="Filter"><option>Filter</option></select>
              <select value={action} onChange={(e) => setAction(e.target.value)} style={{ height: 34, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff', width: 190 }}>
                <option>Choose action</option><option>Delete</option>
              </select>
              <button type="button" onClick={handleApply} style={{ height: 34, borderRadius: 4, border: 'none', background: '#111', color: '#fff', fontWeight: 600, padding: '0 16px', cursor: 'pointer' }}>Apply</button>
            </div>
          </div>
          <div style={{ marginTop: 18, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '44px 1.2fr 160px 120px', gap: 0, background: '#f3f4f6', padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#111827' }}>
              <div><input type="checkbox" checked={allChecked} onChange={toggleAll} /></div>
              <div>Categories</div><div>Priority</div><div>Edit</div>
            </div>
            {pageItems.map((item) => (
              <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '44px 1.2fr 160px 120px', padding: '14px 12px', borderTop: '1px solid #eef2f7', alignItems: 'center', fontSize: 13, color: '#111827' }}>
                <div><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} /></div>
                <div>{item.name}</div>
                <div><input value={String(item.priority)} onChange={(e) => handlePriorityChange(item.id, e.target.value)} onBlur={() => handlePrioritySave(item)} style={{ width: 56, height: 30, borderRadius: 4, border: '1px solid #cbd5e1', padding: '0 8px' }} /></div>
                <div style={{ color: savingId === item.id ? '#9ca3af' : '#111827', cursor: savingId === item.id ? 'not-allowed' : 'pointer' }} onClick={() => { if (savingId === item.id) return; handleEdit(item) }}>
                  {savingId === item.id ? 'Saving...' : 'Edit'}
                </div>
              </div>
            ))}
            {pageItems.length === 0 && <div style={{ padding: '14px 12px', color: '#6b7280' }}>No categories found</div>}
          </div>
          <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
              <button type="button" disabled={prevDisabled} onClick={() => goTo(page - 1)} style={{ ...buttonBase, background: '#f3f4f6', color: prevDisabled ? '#9ca3af' : '#111', cursor: prevDisabled ? 'not-allowed' : 'pointer' }}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" onClick={() => goTo(p)} style={{ ...buttonBase, background: p === page ? '#111' : '#fff', color: p === page ? '#fff' : '#111' }}>{p}</button>
              ))}
              <button type="button" disabled={nextDisabled} onClick={() => goTo(page + 1)} style={{ ...buttonBase, background: '#fff', color: nextDisabled ? '#9ca3af' : '#111', cursor: nextDisabled ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#9ca3af' }}>Establishment id: {String(establishmentId || '')}</div>
        </div>
      </div>
    </MainLayout>
  )
}