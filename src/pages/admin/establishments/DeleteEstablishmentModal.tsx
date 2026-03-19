import { useEffect } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteEstablishmentModal({
  open,
  onClose,
  onConfirm,
}: Props) {
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