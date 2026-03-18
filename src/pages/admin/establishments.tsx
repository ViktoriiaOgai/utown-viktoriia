import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/MainLayout'
import EstablishmentCardModal from './establishments/EstablishmentCardModal'
import DeleteEstablishmentModal from './establishments/DeleteEstablishmentModal'
import {
  IconCaretDown,
  IconChevronRight,
  IconEye,
  IconSearch,
} from '../../assets/icons/EstablishmentsIcons'
import { api } from '../../services/api'
import type { Establishment, PageResponse } from '../../types/establishment'
import {
  asArray,
  getErrorMessage,
  getPageTotalPages,
  normalizeEstablishment,
} from '../../utils/establishments'
import '../../../styles/establishments.scss'

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
  const [isLoading, setIsLoading] = useState(false)
  const [pageError, setPageError] = useState('')
  const [detailsError, setDetailsError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const openEstablishment = (e: Establishment) => {
    setSelected(e)
    setIsModalOpen(true)
    setDetailsError('')

    api
      .get(`/admin/restaurants/${e.id}`)
      .then((r) => {
        const data = r.data
        const detailsSource =
          asArray(data).find((x: any) => Number(x?.id ?? x?.restaurantId) === Number(e.id)) ??
          data?.data ??
          data

        if (detailsSource) {
          setSelected((prev) => normalizeEstablishment({ ...(prev ?? e), ...detailsSource }))
        }
      })
      .catch((error) => {
        setDetailsError(getErrorMessage(error, 'Failed to load establishment details'))
      })
  }

  const closeEstablishment = () => {
    setIsModalOpen(false)
    setSelected(null)
    setDetailsError('')
  }

  useEffect(() => {
    const controller = new AbortController()

    setIsLoading(true)
    setPageError('')

    api
      .get(`/admin/restaurants?page=${page - 1}&size=${pageSize}`, {
        signal: controller.signal,
      })
      .then((r) => {
        const data = r.data as PageResponse<Establishment>
        setRows(asArray(data).map(normalizeEstablishment))
        setTotalPages(getPageTotalPages(data))
      })
      .catch((error) => {
        setRows([])
        setTotalPages(1)
        setPageError(getErrorMessage(error, 'Failed to load establishments'))
      })
      .finally(() => {
        setIsLoading(false)
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
    setDeleteError('')
    if (action !== 'Delete') return
    if (selectedIds.length === 0) return
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    const idsToDelete = [...selectedIds]
    setDeleteError('')

    try {
      await Promise.all(idsToDelete.map((id) => api.delete(`/admin/restaurants/${id}`)))

      setRows((prev) => prev.filter((item) => !idsToDelete.includes(item.id)))
      setSelectedIds([])
      setIsDeleteModalOpen(false)

      if (selected && idsToDelete.includes(selected.id)) {
        closeEstablishment()
      }
    } catch (error) {
      setDeleteError(getErrorMessage(error, 'Failed to delete establishments'))
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
              <span className="crumbLink" onClick={() => navigate('/home')}>
                Home
              </span>
              <span className="crumbSep">/</span>
              <span className="crumbLink" onClick={() => navigate('/profile')}>
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
              <button
                className="applyBtn addBtn"
                onClick={() => navigate('/admin/establishments/add')}
                type="button"
              >
                Add establishment
              </button>

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

              <button className="applyBtn" onClick={handleApply} type="button">
                Apply
              </button>
            </div>
          </div>
        </div>

        {pageError && (
          <div className="pageMessage pageMessageError">
            {pageError}
          </div>
        )}

        {detailsError && (
          <div className="pageMessage pageMessageWarn">
            {detailsError}
          </div>
        )}

        {deleteError && (
          <div className="pageMessage pageMessageError">
            {deleteError}
          </div>
        )}

        {isLoading ? (
          <div className="loadingState">Loading...</div>
        ) : (
          <>
            <div className="tableWrap">
              <table className="table">
                <colgroup>
                  <col style={{ width: '52px' }} />
                  <col style={{ width: '23%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '16%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '11%' }} />
                  <col style={{ width: '56px' }} />
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
                    >
                      <td className="td checkboxCol" onClick={(ev) => ev.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(e.id)}
                          onChange={() => toggleOne(e.id)}
                        />
                      </td>

                      <td className="td cellStrong">{e.name}</td>
                      <td className="td">{e.phone}</td>
                      <td className="td">{e.city}</td>
                      <td className="td cellStrong">{e.ordersCount}</td>

                      <td
                        className="td historyTd"
                        onClick={(ev) => {
                          ev.stopPropagation()
                          navigate(`/admin/establishments/${e.id}/positions/categories`)
                        }}
                      >
                        <span className="viewLink">View</span>
                        <span className="chev">
                          <IconChevronRight />
                        </span>
                      </td>

                      <td
                        className="td historyTd"
                        onClick={(ev) => {
                          ev.stopPropagation()
                          navigate(`/admin/establishments/${e.id}/positions`)
                        }}
                      >
                        <span className="viewLink">View</span>
                        <span className="chev">
                          <IconChevronRight />
                        </span>
                      </td>

                      <td className="td historyTd" onClick={(ev) => ev.stopPropagation()}>
                        <span className="viewLink">View</span>
                        <span className="chev">
                          <IconChevronRight />
                        </span>
                      </td>

                      <td className="td iconCol" onClick={(ev) => ev.stopPropagation()}>
                        <span className="eye" onClick={() => openEstablishment(e)}>
                          <IconEye />
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td className="td emptyRow" colSpan={9}>
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

              <button
                className="pagerBtn"
                onClick={() => goTo(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}

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