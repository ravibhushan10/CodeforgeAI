import { useState, useEffect } from 'react'

const EMPTY = {
  title: '', difficulty: 'Medium', tags: '', companies: '',
  acceptance: '50', premium: 'false',
  description: '', exIn: '', exOut: '', exExp: '',
  constraints: '', hints: '', testcases: '',
  py: '', cpp: '', java: '', js: '',
}


export default function ProblemModal({ open, editingProb, onClose, onSave }) {
  const [f,       setF]       = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)

  // Populate form whenever the modal opens
  useEffect(() => {
    if (!open) return
    if (editingProb) {
      const p = editingProb
      setF({
        title:       p.title || '',
        difficulty:  p.difficulty || 'Medium',
        tags:        (p.tags       || []).join(', '),
        companies:   (p.companies  || []).join(', '),
        acceptance:  String(p.acceptance || 50),
        premium:     p.premium ? 'true' : 'false',
        description: p.description || '',
        exIn:        p.examples?.[0]?.input       || '',
        exOut:       p.examples?.[0]?.output      || '',
        exExp:       p.examples?.[0]?.explanation || '',
        constraints: (p.constraints || []).join('\n'),
        hints:       (p.hints       || []).join('\n'),
        testcases:   p.testCases?.length ? JSON.stringify(p.testCases, null, 2) : '',
        py:          p.starter?.python     || '',
        cpp:         p.starter?.cpp        || '',
        java:        p.starter?.java       || '',
        js:          p.starter?.javascript || '',
      })
    } else {
      setF(EMPTY)
    }
  }, [open, editingProb])

  const up = (key) => (e) => setF((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSave = async () => {
    if (!f.title)           { alert('Title is required');                        return }
    if (!f.description)     { alert('Description is required');                  return }
    if (!f.exIn || !f.exOut){ alert('Example input and output are required');    return }

    let testCases = []
    if (f.testcases.trim()) {
      try { testCases = JSON.parse(f.testcases) }
      catch { alert('Test Cases must be valid JSON — e.g. [{"input":"...","expected":"..."}]'); return }
    }

    const payload = {
      title:       f.title,
      difficulty:  f.difficulty,
      tags:        f.tags.split(',').map((t) => t.trim()).filter(Boolean),
      companies:   f.companies.split(',').map((c) => c.trim()).filter(Boolean),
      acceptance:  parseFloat(f.acceptance) || 50,
      premium:     f.premium === 'true',
      description: f.description,
      examples:    [{ input: f.exIn, output: f.exOut, explanation: f.exExp }],
      constraints: f.constraints.split('\n').map((c) => c.trim()).filter(Boolean),
      hints:       f.hints.split('\n').map((h) => h.trim()).filter(Boolean),
      testCases,
      starter: {
        python:     f.py,
        cpp:        f.cpp,
        java:       f.java,
        javascript: f.js,
      },
    }

    setSaving(true)
    try   { await onSave(payload, editingProb?._id) }
    finally { setSaving(false) }
  }

  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="modal large-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>
          {editingProb
            ? `✏️ Edit — #${editingProb.number} ${editingProb.title}`
            : '+ Add New Problem'}
        </h2>

        <div className="modal-grid">
          <div className="field">
            <label>Title *</label>
            <input className="input" value={f.title} onChange={up('title')} placeholder="Two Sum" />
          </div>
          <div className="field">
            <label>Difficulty *</label>
            <select className="input" value={f.difficulty} onChange={up('difficulty')}>
              <option>Easy</option><option>Medium</option><option>Hard</option>
            </select>
          </div>
          <div className="field">
            <label>Tags (comma-separated)</label>
            <input className="input" value={f.tags} onChange={up('tags')} placeholder="Array, Hash Table" />
          </div>
          <div className="field">
            <label>Companies (comma-separated)</label>
            <input className="input" value={f.companies} onChange={up('companies')} placeholder="Google, Amazon" />
          </div>
          <div className="field">
            <label>Acceptance %</label>
            <input className="input" type="number" value={f.acceptance} onChange={up('acceptance')} min="0" max="100" />
          </div>
          <div className="field">
            <label>Premium</label>
            <select className="input" value={f.premium} onChange={up('premium')}>
              <option value="false">No</option><option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Description * (HTML supported)</label>
          <textarea className="input" rows={4} value={f.description} onChange={up('description')}
            placeholder="Given an array of integers..." />
        </div>

        <div className="modal-grid">
          <div className="field">
            <label>Example Input *</label>
            <input className="input" value={f.exIn} onChange={up('exIn')}
              placeholder="nums = [2,7,11,15], target = 9" />
          </div>
          <div className="field">
            <label>Example Output *</label>
            <input className="input" value={f.exOut} onChange={up('exOut')} placeholder="[0,1]" />
          </div>
        </div>

        <div className="field">
          <label>Explanation</label>
          <input className="input" value={f.exExp} onChange={up('exExp')}
            placeholder="nums[0] + nums[1] == 9" />
        </div>
        <div className="field">
          <label>Constraints (one per line)</label>
          <textarea className="input" rows={3} value={f.constraints} onChange={up('constraints')}
            placeholder={'2 ≤ nums.length ≤ 10⁴\n-10⁹ ≤ nums[i] ≤ 10⁹'} />
        </div>
        <div className="field">
          <label>Hints (one per line)</label>
          <textarea className="input" rows={3} value={f.hints} onChange={up('hints')}
            placeholder={'Try using a hash map.\nFor each number, check if target - num exists.'} />
        </div>
        <div className="field">
          <label>Test Cases JSON (array of &#123;input, expected&#125;)</label>
          <textarea className="input font-mono" rows={4} value={f.testcases} onChange={up('testcases')}
            placeholder={'[{"input":"[2,7,11,15]\\n9","expected":"[0,1]"}]'} />
        </div>

        <details className="starter-details">
          <summary>Starter Code (optional)</summary>
          <div className="starter-grid">
            <div className="field">
              <label>Python</label>
              <textarea className="input font-mono" rows={4} value={f.py} onChange={up('py')}
                placeholder={'class Solution:\n    def solve(self):\n        pass'} />
            </div>
            <div className="field">
              <label>C++</label>
              <textarea className="input font-mono" rows={4} value={f.cpp} onChange={up('cpp')}
                placeholder={'class Solution {\npublic:\n    void solve() {}\n};'} />
            </div>
            <div className="field">
              <label>Java</label>
              <textarea className="input font-mono" rows={4} value={f.java} onChange={up('java')}
                placeholder={'class Solution {\n    public void solve() {}\n}'} />
            </div>
            <div className="field">
              <label>JavaScript</label>
              <textarea className="input font-mono" rows={4} value={f.js} onChange={up('js')}
                placeholder="var solve = function() {};" />
            </div>
          </div>
        </details>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving
              ? <><span className="spinner" /> Saving…</>
              : editingProb ? 'Save Changes' : 'Add Problem'}
          </button>
        </div>
      </div>
    </div>
  )
}
