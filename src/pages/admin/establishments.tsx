import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/MainLayout'
import { apiFetch } from '../../services/api'
import '../../../styles/establishments.scss'

type Establishment = {
  id: number
  name: string
  phone: string
  city: string
  ordersCount: number
  description?: string
  category?: string
  minOrder?: string | number
  deliveryAreas?: string[] | string
  openingHours?: Record<string, string> | string
}

type PageResponse<T> = {
  content?: T[]
  totalPages?: number
  totalElements?: number
  number?: number
  size?: number
}

function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
      />
    </svg>
  )
}

function IconCaretDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7 10l5 5 5-5z" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M9 6l6 6-6 6-1.4-1.4L12.2 12 7.6 7.4z" />
    </svg>
  )
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-2.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
      />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.31 6.3-6.31z"
      />
    </svg>
  )
}

function asArray<T = any>(value: any): T[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.content)) return value.content
  if (Array.isArray(value?.data?.content)) return value.data.content
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.result)) return value.result
  return []
}

function getPageTotalPages(value: any) {
  return Math.max(
    1,
    Number(
      value?.totalPages ??
        value?.data?.totalPages ??
        value?.pages ??
        value?.data?.pages ??
        1
    )
  )
}

function normalizeEstablishment(item: any): Establishment {
  return {
    id: Number(item?.id ?? item?.restaurantId ?? item?.restaurant_id ?? 0),
    name: String(item?.name ?? item?.restaurantName ?? item?.title ?? '—'),
    phone: String(item?.phone ?? item?.phoneNumber ?? item?.number ?? '—'),
    city: String(item?.city ?? item?.addressCity ?? item?.location?.city ?? '—'),
    ordersCount: Number(
      item?.ordersCount ??
        item?.numberOfOrders ??
        item?.orders ??
        item?.orders_count ??
        0
    ),
    description: item?.description ?? item?.about ?? '',
    category:
      item?.category ??
      item?.restaurantCategory ??
      item?.categoryName ??
      item?.type ??
      '',
    minOrder: item?.minOrder ?? item?.minimumOrder ?? item?.min_order ?? '',
    deliveryAreas:
      item?.deliveryAreas ?? item?.deliveryZone ?? item?.deliveryAddress ?? '',
    openingHours: item?.openingHours ?? item?.workingHours ?? item?.hours ?? '',
  }
}

function EstablishmentCardModal({
  open,
  establishment,
  onClose,
}: {
  open: boolean
  establishment: Establishment | null
  onClose: () => void
}) {
  const navigate = useNavigate()
  const [imgBroken, setImgBroken] = useState(false)

  useEffect(() => {
    if (!open) return
    setImgBroken(false)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open || !establishment) return null

  const logoUrl = '/establishment-logo.jpg'

  const deliveryAreasText = Array.isArray(establishment.deliveryAreas)
    ? establishment.deliveryAreas.join(', ')
    : String(establishment.deliveryAreas ?? '')

  const openingHoursText =
    typeof establishment.openingHours === 'string'
      ? establishment.openingHours
      : establishment.openingHours && typeof establishment.openingHours === 'object'
        ? Object.entries(establishment.openingHours)
            .map(([k, v]) => `${k}: ${v}`)
            .join('\n')
        : ''

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          width: 'min(920px, 100%)',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 18px 60px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#7b7b7b',
            padding: 6,
            lineHeight: 0,
            zIndex: 2,
          }}
        >
          <IconClose />
        </button>

        <div style={{ padding: 26 }}>
          <div style={{ display: 'flex', gap: 18, alignItems: 'stretch' }}>
            <div
              style={{
                width: 220,
                height: 165,
                overflow: 'hidden',
                background: '#f1f1f1',
                flex: '0 0 auto',
                borderRadius: 2,
              }}
            >
              {!imgBroken ? (
                <img
                  src={logoUrl}
                  alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={() => setImgBroken(true)}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 56,
                    fontWeight: 800,
                    color: '#2b2b2b',
                  }}
                >
                  {(establishment.name || 'E').trim().charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div
              style={{
                flex: 1,
                background: '#efefef',
                borderRadius: 4,
                position: 'relative',
                height: 165,
                paddingRight: 64,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 18,
                  display: 'grid',
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    navigate(`/admin/establishments/${establishment.id}/edit`)
                  }}
                  style={{
                    height: 40,
                    padding: '0 16px',
                    borderRadius: 6,
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    fontWeight: 600,
                    color: '#1d2a3a',
                    minWidth: 200,
                  }}
                >
                  <span>Edit account</span>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
                </button>

                <button
                  type="button"
                  style={{
                    height: 40,
                    padding: '0 16px',
                    borderRadius: 6,
                    border: '1px solid #e0e0e0',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 20,
                    fontWeight: 600,
                    color: '#1d2a3a',
                    minWidth: 200,
                  }}
                >
                  <span>Menu</span>
                  <span style={{ fontSize: 20, lineHeight: 1 }}>→</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: 18, gap: 26 }}>
            <div style={{ width: 360 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#1d2a3a' }}>
                {establishment.name || 'Establishment Name'}
              </div>

              <div style={{ height: 18 }} />

              <div style={{ display: 'grid', gap: 16, color: '#4a4a4a', fontSize: 13 }}>
                <div>
                  <div style={{ fontWeight: 800, opacity: 0.75 }}>Description:</div>
                  <div style={{ marginTop: 4, lineHeight: 1.45 }}>
                    {establishment.description || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontWeight: 800, opacity: 0.75 }}>City:</div>
                  <div style={{ marginTop: 4, fontWeight: 700 }}>{establishment.city || '—'}</div>
                </div>

                <div>
                  <div style={{ fontWeight: 800, opacity: 0.75 }}>Delivery Areas:</div>
                  <div style={{ marginTop: 4, lineHeight: 1.45 }}>{deliveryAreasText || '—'}</div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ width: 320, marginTop: 2 }}>
              <div style={{ display: 'grid', gap: 18, color: '#4a4a4a' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.75 }}>Phone:</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{establishment.phone || '—'}</div>
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.75 }}>
                    Establishment Category:
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {establishment.category || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.75 }}>Min. order:</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {establishment.minOrder ?? '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.75 }}>Orders:</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>
                    {String(establishment.ordersCount ?? '') || '—'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.75 }}>Opening hours:</div>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'pre-line', lineHeight: 1.45 }}>
                    {openingHoursText || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 18 }} />
        </div>
      </div>
    </div>
  )
}

function DeleteEstablishmentModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 'min(380px, 100%)',
          background: '#fff',
          borderRadius: 8,
          padding: '34px 18px 18px',
          boxShadow: '0 18px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: '#2f2f34',
            marginBottom: 34,
          }}
        >
          Delete establishment?
        </div>

        <button
          type="button"
          onClick={onConfirm}
          style={{
            width: '100%',
            height: 48,
            border: 'none',
            borderRadius: 6,
            background: '#f3f3f4',
            color: '#ef4444',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          Delete
        </button>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: 48,
            border: 'none',
            borderRadius: 6,
            background: '#1f1f22',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function EstablishmentsPage() {
  const navigate = useNavigate()

  const [rows, setRows] = useState<Establishment[]>([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const [selected, setSelected] = useState<Establishment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [action, setAction] = useState('Choose action')
  const [filter, setFilter] = useState('Filter')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const openEstablishment = (e: Establishment) => {
    setSelected(e)
    setIsModalOpen(true)

    apiFetch(`/admin/restaurants/${e.id}`)
      .then((data: any) => {
        const detailsSource =
          asArray(data).find((x: any) => Number(x?.id ?? x?.restaurantId) === Number(e.id)) ??
          data?.data ??
          data

        if (detailsSource) {
          setSelected((prev) => normalizeEstablishment({ ...(prev ?? e), ...detailsSource }))
        }
      })
      .catch(() => {})
  }

  const closeEstablishment = () => {
    setIsModalOpen(false)
    setSelected(null)
  }

  useEffect(() => {
    const controller = new AbortController()

    apiFetch(`/admin/restaurants?page=${page - 1}&size=${pageSize}`, {
      signal: controller.signal,
    })
      .then((data: PageResponse<Establishment>) => {
        setRows(asArray(data).map(normalizeEstablishment))
        setTotalPages(getPageTotalPages(data))
      })
      .catch(() => {
        setRows([])
        setTotalPages(1)
      })

    return () => controller.abort()
  }, [page, pageSize])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
    if (page < 1) setPage(1)
  }, [page, totalPages])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => (r.name || '').toLowerCase().includes(q))
  }, [rows, search])

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages))

  const pagesToShow = useMemo(() => {
    const tp = totalPages
    const maxButtons = 10

    if (tp <= maxButtons) return Array.from({ length: tp }, (_, i) => i + 1)

    const half = Math.floor(maxButtons / 2)
    let start = page - half
    let end = start + maxButtons - 1

    if (start < 1) {
      start = 1
      end = maxButtons
    }

    if (end > tp) {
      end = tp
      start = tp - maxButtons + 1
    }

    return Array.from({ length: maxButtons }, (_, i) => start + i)
  }, [page, totalPages])

  const allChecked = filtered.length > 0 && filtered.every((item) => selectedIds.includes(item.id))

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    if (allChecked) {
      setSelectedIds((prev) => prev.filter((id) => !filtered.some((item) => item.id === id)))
      return
    }

    setSelectedIds((prev) => {
      const next = [...prev]
      filtered.forEach((item) => {
        if (!next.includes(item.id)) next.push(item.id)
      })
      return next
    })
  }

  const handleApply = async () => {
    if (action !== 'Delete') return
    if (selectedIds.length === 0) return
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    const idsToDelete = [...selectedIds]

    try {
      await Promise.all(
        idsToDelete.map((id) =>
          apiFetch(`/admin/restaurants/${id}`, {
            method: 'DELETE',
          }).catch(() => null)
        )
      )

      setRows((prev) => prev.filter((item) => !idsToDelete.includes(item.id)))
      setSelectedIds([])
      setIsDeleteModalOpen(false)

      if (selected && idsToDelete.includes(selected.id)) {
        closeEstablishment()
      }
    } catch {
      setIsDeleteModalOpen(false)
    }
  }

  return (
    <MainLayout>
      <div className="establishments">
        <div className="establishmentsTop">
          <div className="establishmentsTitleBlock">
            <h1 className="establishmentsTitle">Establishments</h1>

            <div className="establishmentsCrumbs">
              <span
                className="crumbLink"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/home')}
              >
                Home
              </span>

              <span className="crumbSep">/</span>

              <span
                className="crumbLink"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
              >
                Users
              </span>

              <span className="crumbSep">/</span>

              <span className="crumbCurrent">Establishments</span>
            </div>
          </div>

          <div className="establishmentsControls">
            <div className="searchBox">
              <span className="searchIcon">
                <IconSearch />
              </span>

              <input
                className="searchInput"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="controlsRow">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value)
                  setPage(1)
                }}
                className="selectReal"
              >
                <option>Filter</option>
                <option>Name</option>
                <option>City</option>
                <option>Orders</option>
              </select>

              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="selectReal"
              >
                <option>Choose action</option>
                <option>Edit</option>
                <option>Delete</option>
                <option>Export</option>
              </select>

              <button className="applyBtn" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="tableWrap">
          <table className="table">
            <colgroup>
              <col style={{ width: '50px' }} />
              <col style={{ width: '22%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '16%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '60px' }} />
            </colgroup>

            <thead>
              <tr>
                <th className="th checkboxCol">
                  <input type="checkbox" checked={allChecked} onChange={toggleAll} />
                </th>

                <th className="th">
                  <span className="thFlex">
                    Name <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th">
                  <span className="thFlex">
                    Phone number <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th">
                  <span className="thFlex">
                    City <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th">
                  <span className="thFlex">
                    Number of orders <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th">
                  <span className="thFlex">
                    Categories <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th">
                  <span className="thFlex">
                    Positions <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th">
                  <span className="thFlex">
                    Order history <span className="thCaret"><IconCaretDown /></span>
                  </span>
                </th>

                <th className="th iconCol" />
              </tr>
            </thead>

            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="tr"
                  onClick={() => openEstablishment(e)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="td checkboxCol" onClick={(ev) => ev.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(e.id)}
                      onChange={() => toggleOne(e.id)}
                    />
                  </td>

                  <td className="td" style={{ fontWeight: 500 }}>{e.name}</td>
                  <td className="td">{e.phone}</td>
                  <td className="td">{e.city}</td>
                  <td className="td" style={{ fontWeight: 600 }}>{e.ordersCount}</td>

                  <td
                    className="td historyTd"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      navigate(`/admin/establishments/${e.id}/positions/categories`)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="viewLink">View</span>
                    <span className="chev"><IconChevronRight /></span>
                  </td>

                  <td
                    className="td historyTd"
                    onClick={(ev) => {
                      ev.stopPropagation()
                      navigate(`/admin/establishments/${e.id}/positions`)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="viewLink">View</span>
                    <span className="chev"><IconChevronRight /></span>
                  </td>

                  <td className="td historyTd" onClick={(ev) => ev.stopPropagation()}>
                    <span className="viewLink">View</span>
                    <span className="chev"><IconChevronRight /></span>
                  </td>

                  <td className="td iconCol" onClick={(ev) => ev.stopPropagation()}>
                    <span
                      className="eye"
                      onClick={() => openEstablishment(e)}
                      style={{ display: 'inline-flex' }}
                    >
                      <IconEye />
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td className="td" colSpan={9} style={{ color: '#6b7280' }}>
                    No establishments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pager">
          <button className="pagerBtn" onClick={() => goTo(page - 1)} disabled={page <= 1}>
            Prev
          </button>

          {pagesToShow.map((p) => (
            <button
              key={p}
              className={`pagerBtn ${p === page ? 'active' : ''}`}
              onClick={() => goTo(p)}
            >
              {p}
            </button>
          ))}

          <button className="pagerBtn" onClick={() => goTo(page + 1)} disabled={page >= totalPages}>
            Next
          </button>
        </div>

        <EstablishmentCardModal
          open={isModalOpen}
          establishment={selected}
          onClose={closeEstablishment}
        />

        <DeleteEstablishmentModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </MainLayout>
  )
}