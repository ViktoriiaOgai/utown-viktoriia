import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MainLayout from '../../../../components/MainLayout'
import { apiFetch } from '../../../../services/api'

function UploadIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3l4 4h-3v7h-2V7H8l4-4zm-7 14h14v2H5v-2z"
      />
    </svg>
  )
}

export default function EditEstablishmentPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [minimumOrder, setMinimumOrder] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [deliveryAreas, setDeliveryAreas] = useState('')
  const [mon, setMon] = useState('9:00 — 22:00')
  const [tue, setTue] = useState('Day off')
  const [wed, setWed] = useState('9:00 — 22:00')
  const [thu, setThu] = useState('9:00 — 22:00')
  const [fri, setFri] = useState('9:00 — 22:00')
  const [sat, setSat] = useState('9:00 — 22:00')
  const [sun, setSun] = useState('9:00 — 22:00')
  const [isSaving, setIsSaving] = useState(false)

  const inputStyle: React.CSSProperties = useMemo(
    () => ({
      width: '100%',
      height: 34,
      borderRadius: 4,
      border: '1px solid #cbd5e1',
      padding: '0 12px',
      fontSize: 13,
      outline: 'none',
      background: '#fff',
    }),
    []
  )

  const textareaStyle: React.CSSProperties = useMemo(
    () => ({
      width: '100%',
      borderRadius: 4,
      border: '1px solid #cbd5e1',
      padding: '10px 12px',
      fontSize: 13,
      outline: 'none',
      background: '#fff',
      resize: 'none',
      minHeight: 92,
    }),
    []
  )

  const labelStyle: React.CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      fontWeight: 700,
      color: '#111827',
      marginBottom: 6,
    }),
    []
  )

  const selectStyle: React.CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      appearance: 'auto',
    }),
    [inputStyle]
  )

  const hoursWrapStyle: React.CSSProperties = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      maxWidth: 220,
    }),
    []
  )

  const dayStyle: React.CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      background: '#fff',
    }),
    [inputStyle]
  )

  const timeStyle: React.CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      background: '#fff',
    }),
    [inputStyle]
  )

  useEffect(() => {
    if (!id) return

    apiFetch(`/admin/restaurants/${id}`)
      .then((data: any) => {
        const details = data?.data ?? data

        setName(String(details?.name ?? ''))
        setDescription(String(details?.description ?? ''))
        setMinimumOrder(String(details?.minOrder ?? details?.minimumOrder ?? ''))
        setPhone(String(details?.phone ?? details?.phoneNumber ?? ''))
        setCategory(String(details?.category ?? ''))
        setCity(String(details?.city ?? ''))

        const areas = details?.deliveryAreas
        if (Array.isArray(areas)) {
          setDeliveryAreas(areas.join('\n'))
        } else {
          setDeliveryAreas(String(areas ?? ''))
        }

        const hours = details?.openingHours ?? details?.workingHours ?? {}
        setMon(String(hours?.Monday ?? hours?.MONDAY ?? '9:00 — 22:00'))
        setTue(String(hours?.Tuesday ?? hours?.TUESDAY ?? 'Day off'))
        setWed(String(hours?.Wednesday ?? hours?.WEDNESDAY ?? '9:00 — 22:00'))
        setThu(String(hours?.Thursday ?? hours?.THURSDAY ?? '9:00 — 22:00'))
        setFri(String(hours?.Friday ?? hours?.FRIDAY ?? '9:00 — 22:00'))
        setSat(String(hours?.Saturday ?? hours?.SATURDAY ?? '9:00 — 22:00'))
        setSun(String(hours?.Sunday ?? hours?.SUNDAY ?? '9:00 — 22:00'))
      })
      .catch(() => {})
  }, [id])

  const handleSave = async () => {
    if (!id) return

    setIsSaving(true)

    try {
      await apiFetch(`/admin/restaurants/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          id: Number(id),
          name,
          description,
          minOrder: minimumOrder,
          minimumOrder,
          phone,
          phoneNumber: phone,
          category,
          city,
          deliveryAreas: deliveryAreas
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean),
          openingHours: {
            Monday: mon,
            Tuesday: tue,
            Wednesday: wed,
            Thursday: thu,
            Friday: fri,
            Saturday: sat,
            Sunday: sun,
          },
        }),
      })

      navigate('/admin/establishments')
    } catch (err) {
      console.error(err)
      alert('Failed to save establishment')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
            Edit establishment
          </div>

          <div style={{ marginTop: 10, fontSize: 13, color: '#6b7280' }}>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/home')}>
              Home
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
              Users
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span
              style={{ color: '#6d4cff', cursor: 'pointer' }}
              onClick={() => navigate('/admin/establishments')}
            >
              Establishments
            </span>
            <span style={{ margin: '0 8px' }}>/</span>
            <span>Edit</span>
          </div>

          <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: 'min(820px, 100%)',
                border: '1px solid #d9d9d9',
                borderRadius: 10,
                background: '#fff',
                padding: 34,
              }}
            >
              <div style={{ width: 'min(640px, 100%)', margin: '0 auto' }}>
                <div
                  style={{
                    display: 'flex',
                    height: 150,
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#f3f3f3',
                  }}
                >
                  <div
                    style={{
                      width: 170,
                      background: '#ededed',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#111827',
                    }}
                  >
                    <div style={{ opacity: 0.75 }}>
                      <UploadIcon />
                    </div>
                  </div>
                  <div style={{ flex: 1, background: '#f3f3f3' }} />
                </div>

                <div style={{ height: 22 }} />

                <div style={{ display: 'grid', gap: 14 }}>
                  <div>
                    <div style={labelStyle}>Establishment name</div>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" style={inputStyle} />
                  </div>

                  <div>
                    <div style={labelStyle}>Description</div>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" style={textareaStyle} />
                  </div>

                  <div>
                    <div style={labelStyle}>Working hours</div>
                    <div style={hoursWrapStyle}>
                      <input value="Monday" readOnly style={dayStyle} />
                      <input value={mon} onChange={(e) => setMon(e.target.value)} style={timeStyle} />
                      <input value="Tuesday" readOnly style={dayStyle} />
                      <input value={tue} onChange={(e) => setTue(e.target.value)} style={timeStyle} />
                      <input value="Wednesday" readOnly style={dayStyle} />
                      <input value={wed} onChange={(e) => setWed(e.target.value)} style={timeStyle} />
                      <input value="Thursday" readOnly style={dayStyle} />
                      <input value={thu} onChange={(e) => setThu(e.target.value)} style={timeStyle} />
                      <input value="Friday" readOnly style={dayStyle} />
                      <input value={fri} onChange={(e) => setFri(e.target.value)} style={timeStyle} />
                      <input value="Saturday" readOnly style={dayStyle} />
                      <input value={sat} onChange={(e) => setSat(e.target.value)} style={timeStyle} />
                      <input value="Sunday" readOnly style={dayStyle} />
                      <input value={sun} onChange={(e) => setSun(e.target.value)} style={timeStyle} />
                    </div>
                  </div>

                  <div>
                    <div style={labelStyle}>Minimum order</div>
                    <input value={minimumOrder} onChange={(e) => setMinimumOrder(e.target.value)} placeholder="Enter amount" style={inputStyle} />
                  </div>

                  <div>
                    <div style={labelStyle}>Phone number</div>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter number" style={inputStyle} />
                  </div>

                  <div>
                    <div style={labelStyle}>Establishment category</div>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="Fast food">Fast food</option>
                      <option value="Cafe">Cafe</option>
                      <option value="Restaurant">Restaurant</option>
                    </select>
                  </div>

                  <div>
                    <div style={labelStyle}>City</div>
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" style={inputStyle} />
                  </div>

                  <div>
                    <div style={labelStyle}>Delivery areas</div>
                    <textarea value={deliveryAreas} onChange={(e) => setDeliveryAreas(e.target.value)} placeholder="Enter areas" style={{ ...textareaStyle, minHeight: 110 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 22 }}>
            <button
              onClick={() => navigate(-1)}
              style={{
                width: 170,
                height: 46,
                borderRadius: 6,
                border: 'none',
                background: '#f3f4f6',
                color: '#111827',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              style={{
                width: 170,
                height: 46,
                borderRadius: 6,
                border: 'none',
                background: '#111',
                color: '#fff',
                fontWeight: 600,
                cursor: isSaving ? 'not-allowed' : 'pointer',
                opacity: isSaving ? 0.7 : 1,
              }}
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}