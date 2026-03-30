/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import MainLayout from '../../../../../../components/MainLayout'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../../../../../services/api'
import '../../../../../../styles/categories.scss'

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
    name: String(item?.name ?? item?.title ?? ''),
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
    api.get('/admin/categories')
      .then((res) => {
        const list = asArray(res.data).map(normalizeCategory)
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
      await api.put(`/admin/categories/${item.id}`, { id: item.id, name: item.name, priority: item.priority, sortOrder: item.priority, restaurantId: Number(establishmentId) })
    } catch (err) { console.error(err); alert('Failed to save category priority') } finally { setSavingId(null) }
  }

  const handleEdit = async (item: CategoryRow) => {
    const nextName = window.prompt('Edit category name', item.name)
    if (nextName === null || !nextName.trim()) return
    setSavingId(item.id)
    try {
      await api.put(`/admin/categories/${item.id}`, { id: item.id, name: nextName.trim(), priority: item.priority, sortOrder: item.priority, restaurantId: Number(establishmentId) })
      setAllItems((prev) => prev.map((category) => category.id === item.id ? { ...category, name: nextName.trim() } : category))
    } catch (err) { console.error(err); alert('Failed to save category') } finally { setSavingId(null) }
  }

  const handleApply = async () => {
    if (action !== 'Delete' || selectedIds.length === 0) return
    try {
      await Promise.all(selectedIds.map((categoryId) => api.delete(`/admin/categories/${categoryId}`).catch(() => null)))
      setAllItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)))
      setSelectedIds([])
    } catch (err) { console.error(err); alert('Failed to delete categories') }
  }

  return (
    <MainLayout>
      <div className="categories">
        <div className="categories__inner">
          <div className="categories__header">
            <div className="categories__header-left">
              <div className="categories__title">Categories</div>
              <button type="button" className={`categories__add-btn${hoverAddPos ? ' categories__add-btn--active' : ''}`} onClick={() => { if (!establishmentId) return; navigate(`/admin/establishments/${establishmentId}/positions/add`) }} onMouseEnter={() => setHoverAddPos(true)} onMouseLeave={() => setHoverAddPos(false)}>
                <span>+</span> Add position
              </button>
              <button type="button" className={`categories__add-btn${hoverAddCat ? ' categories__add-btn--active' : ''}`} onClick={() => { if (!establishmentId) return; navigate(`/admin/establishments/${establishmentId}/positions/categories/add`) }} onMouseEnter={() => setHoverAddCat(true)} onMouseLeave={() => setHoverAddCat(false)}>
                <span>+</span> Add category
              </button>
            </div>
            <input className="categories__search" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>

          <div className="categories__toolbar">
            <div className="categories__breadcrumb">
              <span className="categories__breadcrumb-link" onClick={() => navigate('/admin/home')}>Home</span>
              <span className="categories__breadcrumb-sep">/</span>
              <span className="categories__breadcrumb-link" onClick={() => navigate('/admin/profile')}>Users</span>
              <span className="categories__breadcrumb-sep">/</span>
              <span className="categories__breadcrumb-link" onClick={() => navigate('/admin/establishments')}>Establishments</span>
              <span className="categories__breadcrumb-sep">/</span>
              <span className="categories__breadcrumb-link" onClick={() => navigate(`/admin/establishments/${establishmentId}/positions`)}>Positions</span>
            </div>
            <div className="categories__actions">
              <select className="categories__select" defaultValue="Filter"><option>Filter</option></select>
              <select className="categories__select" value={action} onChange={(e) => setAction(e.target.value)}>
                <option>Choose action</option><option>Delete</option>
              </select>
              <button type="button" className="categories__apply-btn" onClick={handleApply}>Apply</button>
            </div>
          </div>

          <div className="categories__table">
            <div className="categories__table-header">
              <div><input type="checkbox" checked={allChecked} onChange={toggleAll} /></div>
              <div>Categories</div>
              <div>Priority</div>
              <div>Edit</div>
            </div>
            {pageItems.map((item) => (
              <div key={item.id} className="categories__table-row">
                <div><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleOne(item.id)} /></div>
                <div>{item.name}</div>
                <div><input className="categories__priority-input" value={String(item.priority)} onChange={(e) => handlePriorityChange(item.id, e.target.value)} onBlur={() => handlePrioritySave(item)} /></div>
                <div className={`categories__edit-btn${savingId === item.id ? ' categories__edit-btn--saving' : ''}`} onClick={() => { if (savingId === item.id) return; handleEdit(item) }}>
                  {savingId === item.id ? 'Saving...' : 'Edit'}
                </div>
              </div>
            ))}
            {pageItems.length === 0 && <div className="categories__empty">No categories found</div>}
          </div>

          <div className="categories__pagination">
            <div className="categories__pagination-inner">
              <button type="button" disabled={prevDisabled} className={`categories__page-btn${prevDisabled ? ' categories__page-btn--disabled' : ''}`} onClick={() => goTo(page - 1)}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} type="button" onClick={() => goTo(p)} className={`categories__page-btn${p === page ? ' categories__page-btn--active' : ''}`}>{p}</button>
              ))}
              <button type="button" disabled={nextDisabled} className={`categories__page-btn${nextDisabled ? ' categories__page-btn--disabled' : ''}`} onClick={() => goTo(page + 1)}>Next</button>
            </div>
          </div>
          <div className="categories__footer">Establishment id: {String(establishmentId || '')}</div>
        </div>
      </div>
    </MainLayout>
  )
}