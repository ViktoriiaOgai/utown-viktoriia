import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconClose } from '../../../assets/icons/EstablishmentsIcons'
import type { Establishment } from '../../../types/establishment'

type Props = {
  open: boolean
  establishment: Establishment | null
  onClose: () => void
}

export default function EstablishmentCardModal({
  open,
  establishment,
  onClose,
}: Props) {
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
          background: '#ffffff',
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

          <div style={{ display: 'flex', marginTop: 20, gap: 26 }}>
            <div style={{ width: 360 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1d2a3a' }}>
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
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      whiteSpace: 'pre-line',
                      lineHeight: 1.45,
                    }}
                  >
                    {openingHoursText || '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height: 12 }} />
        </div>
      </div>
    </div>
  )
}