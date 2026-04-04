import { useState, useEffect } from 'react'

const CARDS = [
  { key: 'problems', icon: '📋', label: 'Total Problems' },
  { key: 'users',    icon: '👥', label: 'Registered Users' },
  { key: 'pro',      icon: '⭐', label: 'Pro Users' },
  { key: 'premium',  icon: '🔒', label: 'Premium Problems' },
]

export default function StatsPage({ apiFetch, toast }) {
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const [probs, users] = await Promise.all([
          apiFetch('/api/problems?limit=1000'),
          apiFetch('/api/users'),
        ])
        setStats({
          problems: probs.total ?? probs.problems?.length ?? 0,
          users:    users.length ?? 0,
          pro:      users.filter(u => u.plan === 'pro').length,
          premium:  probs.problems?.filter(p => p.premium).length ?? 0,
        })
      } catch (e) {
        toast('Failed to load stats: ' + e.message, 'error')
      } finally {
        setLoading(false)
      }
    })()
  }, [apiFetch, toast])

  return (
    <>
      <div className="page-header">
        <div><h1>Statistics</h1><p>Platform overview</p></div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <span className="spinner spinner-lg" />
        </div>
      ) : (
        <div className="stats-grid">
          {CARDS.map(c => (
            <div key={c.key} className="stat-card">
              <div className="stat-val">{stats?.[c.key] ?? '—'}</div>
              <div className="stat-label">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
