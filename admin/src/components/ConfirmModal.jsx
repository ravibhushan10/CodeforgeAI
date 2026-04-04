
export default function ConfirmModal({ confirm, onClose }) {
  if (!confirm) return null

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 400, textAlign: 'center' }}>
        <h3>{confirm.msg}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '.85rem', margin: '8px 0 24px' }}>
          {confirm.sub}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-danger"
            onClick={() => { confirm.onOk(); onClose() }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
