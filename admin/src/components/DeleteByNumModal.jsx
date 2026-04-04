import { useState, useEffect } from 'react'

export default function DeleteByNumModal({ open, problems, onClose, onDeleted, apiFetch, toast }) {
  const [num,      setNum]      = useState('')
  const [preview,  setPreview]  = useState(null)
  const [target,   setTarget]   = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (open) { setNum(''); setPreview(null); setTarget(null) }
  }, [open])

  const doPreview = () => {
    const n = parseInt(num)
    if (!n || n < 1) { toast('Enter a valid problem number', 'error'); return }
    const p = problems.find(x => x.number === n)
    if (!p) { setPreview({ found: false, n }); setTarget(null); return }
    setTarget({ id: p._id, num: n, title: p.title })
    setPreview({ found: true, p, total: problems.length })
  }

  const doDelete = async () => {
    if (!target) return
    setDeleting(true)
    try {
      const result = await apiFetch(`/api/problems/number/${target.num}`, { method: 'DELETE' })
      toast(result.message, 'success')
      onDeleted()
      onClose()
    } catch (e) {
      toast('Delete failed: ' + e.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>Delete Problem by Number</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '10px 0 20px', fontSize: '.875rem' }}>
          Enter the problem number to delete. All remaining problems will be renumbered automatically.
        </p>
        <div className="field">
          <label>Problem Number</label>
          <input
            className="input" type="number" placeholder="e.g. 5" min="1"
            value={num} onChange={e => setNum(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doPreview()}
          />
        </div>
        {preview && (
          <div className="del-preview">
            {preview.found ? (
              <>
                <div className="preview-found">
                  <strong>Found:</strong> #{preview.p.number} — {preview.p.title}{' '}
                  <span className={`badge badge-${preview.p.difficulty.toLowerCase()}`}>
                    {preview.p.difficulty}
                  </span>
                </div>
                <div className="preview-note">
                  After deletion, problems #{preview.p.number + 1}…{preview.total} will be
                  renumbered to #{preview.p.number}…{preview.total - 1}.
                </div>
              </>
            ) : (
              <span style={{ color: 'var(--red)' }}>Problem #{preview.n} not found.</span>
            )}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-secondary" onClick={doPreview}>Preview</button>
          <button className="btn btn-danger" disabled={!target || deleting} onClick={doDelete}>
            {deleting ? <><span className="spinner" /> Deleting…</> : 'Delete & Renumber'}
          </button>
        </div>
      </div>
    </div>
  )
}
