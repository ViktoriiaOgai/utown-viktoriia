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
      height: 40,
      borderRadius: 6,
      border: '1px solid #d1d5db',
      padding: '0 12px',
      fontSize: 14,
      outline: 'none',
      background: '#fff',
      boxSizing: 'border-box',
      color: '#111827',
      transition: 'border-color 0.15s',
    }),
    []
  )

  const textareaStyle: CSSProperties = useMemo(
    () => ({
      width: '100%',
      borderRadius: 6,
      border: '1px solid #d1d5db',
      padding: '10px 12px',
      fontSize: 14,
      outline: 'none',
      background: '#fff',
      resize: 'none',
      minHeight: 92,
      boxSizing: 'border-box',
      color: '#111827',
      transition: 'border-color 0.15s',
    }),
    []
  )

  const labelStyle: CSSProperties = useMemo(
    () => ({
      fontSize: 13,
      fontWeight: 600,
      color: '#374151',
      marginBottom: 6,
      display: 'block',
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
      gridTemplateColumns: '116px 1fr',
      gap: 8,
      maxWidth: 320,
    }),
    []
  )

  const dayStyle: CSSProperties = useMemo(
    () => ({
      ...inputStyle,
      background: '#f9fafb',
      color: '#6b7280',
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
    <div style={{ padding: '26px 8px 12px 8px', minHeight: '100%' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: '#111827', letterSpacing: -0.4 }}>
          {title}
        </div>

        <div style={{ marginTop: 12, fontSize: 14, color: '#8b8b8b', display: 'flex', gap: 8 }}>
          <span style={{ color: '#6c63ff', cursor: 'pointer', fontWeight: 600 }} onClick={onNavigateHome}>
            Home
          </span>
          <span>/</span>
          <span style={{ color: '#6c63ff', cursor: 'pointer', fontWeight: 600 }} onClick={onNavigateProfile}>
            Users
          </span>
          <span>/</span>
          <span
            style={{ color: '#6c63ff', cursor: 'pointer', fontWeight: 600 }}
            onClick={onNavigateEstablishments}
          >
            Establishments
          </span>
          <span>/</span>
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
              color: '#6b7280',
            }}
          >
            Loading...
          </div>
        ) : (
          <>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  width: 'min(860px, 100%)',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  background: '#fff',
                  padding: 32,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}
              >
                <div style={{ width: 'min(640px, 100%)', margin: '0 auto' }}>
                  <div
                    style={{
                      display: 'flex',
                      height: 156,
                      overflow: 'hidden',
                      background: '#f9fafb',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <div
                      style={{
                        width: 188,
                        background: '#f3f4f6',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#9ca3af',
                        borderRight: '1px solid #e5e7eb',
                        borderRadius: '8px 0 0 8px',
                      }}
                    >
                      <div style={{ opacity: 0.75 }}>
                        <UploadIcon />
                      </div>
                    </div>
                    <div style={{ flex: 1, background: '#f9fafb' }} />
                  </div>

                  <div style={{ height: 22 }} />

                  <div style={{ display: 'grid', gap: 16 }}>
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

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12 }}>
              <button
                onClick={onCancel}
                style={{
                  width: 160,
                  height: 42,
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  background: '#ffffff',
                  color: '#374151',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                Cancel
              </button>

              <button
                style={{
                  width: 160,
                  height: 42,
                  borderRadius: 8,
                  border: 'none',
                  background: '#1f1f1f',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  transition: 'background 0.15s',
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