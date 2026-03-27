type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteClientModal({ open, onClose, onConfirm }: Props) {
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 'min(280px, 100%)',
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          padding: '24px 16px 16px',
        }}
      >
        <div style={{ textAlign: 'center', fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>
          Delete client?
        </div>

        <div style={{ display: 'grid', gap: 8 }}>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              height: 48,
              border: 'none',
              borderRadius: 10,
              background: '#f3f4f6',
              color: '#ef4444',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              height: 48,
              border: 'none',
              borderRadius: 10,
              background: '#111111',
              color: '#fff',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}