import { useMemo } from 'react'
import type { CSSProperties } from 'react'
import { UploadIcon } from '../../../assets/icons/EstablishmentsIcons'
import type { EstablishmentFormValues } from '../../../types/establishment'

type Props = {
  title: string
  breadcrumbLast: string
  values: EstablishmentFormValues
  isSaving: boolean
  isLoading?: boolean
  error?: string
  submitText: string
  onChange: (field: keyof EstablishmentFormValues, value: string) => void
  onSubmit: () => void
  onCancel: () => void
  onNavigateHome: () => void
  onNavigateProfile: () => void
  onNavigateEstablishments: () => void
}

export default function EstablishmentForm({
  title,
  breadcrumbLast,
  values,
  isSaving,
  isLoading = false,
  error = '',
  submitText,
  onChange,
  onSubmit,
  onCancel,
  onNavigateHome,
  onNavigateProfile,
  onNavigateEstablishments,
}: Props) {
  const inputStyle: CSSProperties = useMemo(
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

  const textareaStyle: CSSProperties = useMemo(
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

  const labelStyle: CSSProperties = useMemo(
    () => ({
      fontSize: 12,
      fontWeight: 700,
      color: '#111827',
      marginBottom: 6,
    }),
    []
  )

  const selectStyle: CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      appearance: 'auto',
    }),
    [inputStyle]
  )

  const hoursWrapStyle: CSSProperties = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 8,
      maxWidth: 220,
    }),
    []
  )

  const dayStyle: CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      background: '#fff',
    }),
    [inputStyle]
  )

  const timeStyle: CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      background: '#fff',
    }),
    [inputStyle]
  )

  return (
    <div style={{ padding: 34, paddingTop: 28, background: '#fff', minHeight: '100%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: '#0f172a', letterSpacing: -0.5 }}>
          {title}
        </div>

        <div style={{ marginTop: 10, fontSize: 13, color: '#6b7280' }}>
          <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={onNavigateHome}>
            Home
          </span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={onNavigateProfile}>
            Users
          </span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#6d4cff', cursor: 'pointer' }} onClick={onNavigateEstablishments}>
            Establishments
          </span>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{breadcrumbLast}</span>
        </div>

        {error && (
          <div
            style={{
              marginTop: 18,
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

        {isLoading ? (
          <div
            style={{
              marginTop: 26,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 240,
              fontSize: 16,
              fontWeight: 600,
              color: '#475569',
            }}
          >
            Loading...
          </div>
        ) : (
          <>
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
                      <input
                        value={values.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="Enter name"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <div style={labelStyle}>Description</div>
                      <textarea
                        value={values.description}
                        onChange={(e) => onChange('description', e.target.value)}
                        placeholder="Enter description"
                        style={textareaStyle}
                      />
                    </div>

                    <div>
                      <div style={labelStyle}>Working hours</div>
                      <div style={hoursWrapStyle}>
                        <input value="Monday" readOnly style={dayStyle} />
                        <input value={values.mon} onChange={(e) => onChange('mon', e.target.value)} style={timeStyle} />
                        <input value="Tuesday" readOnly style={dayStyle} />
                        <input value={values.tue} onChange={(e) => onChange('tue', e.target.value)} style={timeStyle} />
                        <input value="Wednesday" readOnly style={dayStyle} />
                        <input value={values.wed} onChange={(e) => onChange('wed', e.target.value)} style={timeStyle} />
                        <input value="Thursday" readOnly style={dayStyle} />
                        <input value={values.thu} onChange={(e) => onChange('thu', e.target.value)} style={timeStyle} />
                        <input value="Friday" readOnly style={dayStyle} />
                        <input value={values.fri} onChange={(e) => onChange('fri', e.target.value)} style={timeStyle} />
                        <input value="Saturday" readOnly style={dayStyle} />
                        <input value={values.sat} onChange={(e) => onChange('sat', e.target.value)} style={timeStyle} />
                        <input value="Sunday" readOnly style={dayStyle} />
                        <input value={values.sun} onChange={(e) => onChange('sun', e.target.value)} style={timeStyle} />
                      </div>
                    </div>

                    <div>
                      <div style={labelStyle}>Minimum order</div>
                      <input
                        value={values.minimumOrder}
                        onChange={(e) => onChange('minimumOrder', e.target.value)}
                        placeholder="Enter amount"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <div style={labelStyle}>Phone number</div>
                      <input
                        value={values.phone}
                        onChange={(e) => onChange('phone', e.target.value)}
                        placeholder="Enter number"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <div style={labelStyle}>Establishment category</div>
                      <select
                        value={values.category}
                        onChange={(e) => onChange('category', e.target.value)}
                        style={selectStyle}
                      >
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
                      <input
                        value={values.city}
                        onChange={(e) => onChange('city', e.target.value)}
                        placeholder="Enter city"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <div style={labelStyle}>Delivery areas</div>
                      <textarea
                        value={values.deliveryAreas}
                        onChange={(e) => onChange('deliveryAreas', e.target.value)}
                        placeholder="Enter areas"
                        style={{ ...textareaStyle, minHeight: 110 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 26, display: 'flex', justifyContent: 'center', gap: 22 }}>
              <button
                onClick={onCancel}
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
                onClick={onSubmit}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : submitText}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}