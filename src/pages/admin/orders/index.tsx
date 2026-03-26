import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import MainLayout from "../../../components/MainLayout"
import "../../../../styles/orders.scss"

type OrderItem = {
  id: number | string
  clientName: string
  clientAddress: string
  establishmentName: string
  establishmentAddress: string
  riderName: string
  riderTransport: string
  orderNumber: string
  amount: string
  orderTime: string
  pickupTime: string
  deliveryTime: string
  itemsText: string
}

type RawOrderItem = {
  id?: number | string
  userName?: string
  fullAddress?: string
  restaurantName?: string
  restaurantAddress?: string
  courierName?: string
  number?: number | string
  totalSum?: number
  time?: string
  details?: string
}

const mockOrders: OrderItem[] = [
  {
    id: 1,
    clientName: "Client Name 1",
    clientAddress: "12 Mugyo-ro, Jung-gu, Seoul, Jeong-o Building",
    establishmentName: "Fast Chicken",
    establishmentAddress: "12 Mugyo-ro, Jung-gu, Seoul, Jeong-o Building",
    riderName: "Rider Name",
    riderTransport: "Transport: Motorcycle",
    orderNumber: "No. 123456789",
    amount: "30,000",
    orderTime: "9:00 AM",
    pickupTime: "9:50 AM",
    deliveryTime: "10:30 AM",
    itemsText: "Double Burger, Hamburger",
  },
]

const pageSize = 7

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [selectedAction, setSelectedAction] = useState("")
  const [selectedRows, setSelectedRows] = useState<Array<number | string>>([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    let ignore = false

    async function loadOrders() {
      setLoading(true)

      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("adminToken") ||
          ""

        const response = await fetch(
          "https://utown-api.habsida.net/api/admin/orders?page=0&size=10",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) throw new Error("error")

        const data = await response.json()

        const rawOrders = Array.isArray(data)
          ? data
          : Array.isArray(data?.content)
          ? data.content
          : []

        const mapped = rawOrders.map((item: RawOrderItem, i: number) => ({
          id: item?.id ?? i,
          clientName: item?.userName ?? "Client Name 1",
          clientAddress:
            item?.fullAddress ??
            "12 Mugyo-ro, Jung-gu, Seoul, Jeong-o Building",
          establishmentName: item?.restaurantName ?? "Fast Chicken",
          establishmentAddress:
            item?.restaurantAddress ??
            "12 Mugyo-ro, Jung-gu, Seoul, Jeong-o Building",
          riderName: item?.courierName ?? "Rider Name",
          riderTransport: "Transport: Motorcycle",
          orderNumber: `No. ${item?.number ?? item?.id ?? "123456789"}`,
          amount:
            typeof item?.totalSum === "number"
              ? item.totalSum.toLocaleString()
              : "30,000",
          orderTime: item?.time ?? "9:00 AM",
          pickupTime: "9:50 AM",
          deliveryTime: "10:30 AM",
          itemsText: item?.details ?? "Double Burger, Hamburger",
        }))

        if (!ignore) {
          setOrders(mapped.length ? mapped : mockOrders)
        }
      } catch {
        if (!ignore) setOrders(mockOrders)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadOrders()

    return () => {
      ignore = true
    }
  }, [])

  const filtered = useMemo(() => {
    let result = orders.filter((o) => {
      const q = search.toLowerCase()
      return (
        o.clientName.toLowerCase().includes(q) ||
        o.establishmentName.toLowerCase().includes(q) ||
        o.riderName.toLowerCase().includes(q) ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.amount.toLowerCase().includes(q) ||
        o.itemsText.toLowerCase().includes(q)
      )
    })

    if (selectedFilter === "client-asc") {
      result = [...result].sort((a, b) => a.clientName.localeCompare(b.clientName))
    }

    if (selectedFilter === "client-desc") {
      result = [...result].sort((a, b) => b.clientName.localeCompare(a.clientName))
    }

    if (selectedFilter === "amount-asc") {
      result = [...result].sort(
        (a, b) =>
          Number(a.amount.replaceAll(",", "")) -
          Number(b.amount.replaceAll(",", ""))
      )
    }

    if (selectedFilter === "amount-desc") {
      result = [...result].sort(
        (a, b) =>
          Number(b.amount.replaceAll(",", "")) -
          Number(a.amount.replaceAll(",", ""))
      )
    }

    return result
  }, [orders, search, selectedFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const allCurrentSelected =
    paginated.length > 0 &&
    paginated.every((item) => selectedRows.includes(item.id))

  function toggleRow(id: number | string) {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  function toggleAll() {
    const currentIds = paginated.map((item) => item.id)
    const allSelected = currentIds.every((id) => selectedRows.includes(id))

    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !currentIds.includes(id)))
      return
    }

    setSelectedRows((prev) => [...new Set([...prev, ...currentIds])])
  }

  function handleApply() {
    if (!selectedAction) return

    if (selectedRows.length === 0) {
      alert("Сначала выбери хотя бы один order")
      return
    }

    if (selectedAction === "delete") {
      const confirmed = window.confirm("Удалить выбранные orders?")
      if (!confirmed) return

      setOrders((prev) => prev.filter((item) => !selectedRows.includes(item.id)))
      setSelectedRows([])
    }

    if (selectedAction === "clear") {
      setSelectedRows([])
    }
  }

  return (
    <MainLayout>
      <div className="orders-page">
        <div className="orders-page__top">
          <div className="orders-page__left">
            <h1 className="orders-page__title">Order History</h1>

            <div className="orders-page__breadcrumbs">
              <Link to="/admin/home" className="orders-page__link">
                Home
              </Link>
              <span>/</span>

              <Link to="/admin/profile" className="orders-page__link">
                Users
              </Link>
              <span>/</span>

              <span className="orders-page__current">Order History</span>
            </div>
          </div>

          <div className="orders-page__right">
            <input
              className="orders-page__search"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />

            <div className="orders-page__toolbar">
              <select
                className="orders-page__select orders-page__select--filter"
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value)
                  setPage(1)
                }}
              >
                <option value="">Filter</option>
                <option value="client-asc">Client A-Z</option>
                <option value="client-desc">Client Z-A</option>
                <option value="amount-asc">Amount low to high</option>
                <option value="amount-desc">Amount high to low</option>
              </select>

              <select
                className="orders-page__select orders-page__select--action"
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
              >
                <option value="">Choose Action</option>
                <option value="delete">Delete</option>
                <option value="clear">Clear selection</option>
              </select>

              <button className="orders-page__apply" onClick={handleApply}>
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="orders-page__table-wrap">
          <table className="orders-page__table">
            <thead>
              <tr>
                <th className="orders-page__checkbox">
                  <input
                    type="checkbox"
                    checked={allCurrentSelected}
                    onChange={toggleAll}
                  />
                </th>
                <th>
                  Client <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Establishment <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Rider <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Order Number <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Amount <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Order <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Pickup <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Delivery <span className="orders-page__arrow">▾</span>
                </th>
                <th>
                  Items <span className="orders-page__arrow">▾</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="orders-page__state">
                    Loading...
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="orders-page__state">
                    No orders found
                  </td>
                </tr>
              ) : (
                paginated.map((o) => (
                  <tr key={o.id}>
                    <td className="orders-page__checkbox">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(o.id)}
                        onChange={() => toggleRow(o.id)}
                      />
                    </td>

                    <td className="orders-page__wide">
                      <div className="orders-page__main">{o.clientName}</div>
                      <div className="orders-page__sub">{o.clientAddress}</div>
                    </td>

                    <td className="orders-page__wide">
                      <div className="orders-page__main">{o.establishmentName}</div>
                      <div className="orders-page__sub">{o.establishmentAddress}</div>
                    </td>

                    <td className="orders-page__wide">
                      <div className="orders-page__main">{o.riderName}</div>
                      <div className="orders-page__sub">{o.riderTransport}</div>
                    </td>

                    <td>{o.orderNumber}</td>
                    <td>{o.amount}</td>
                    <td>{o.orderTime}</td>
                    <td>{o.pickupTime}</td>
                    <td>{o.deliveryTime}</td>
                    <td className="orders-page__items">{o.itemsText}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="orders-page__pagination">
          <button
            className="orders-page__page"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={
                page === p
                  ? "orders-page__page orders-page__page--active"
                  : "orders-page__page"
              }
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="orders-page__page"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </MainLayout>
  )
}