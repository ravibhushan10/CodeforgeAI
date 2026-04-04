import { useState, useCallback } from 'react'
import Sidebar      from '../components/Sidebar'
import Toasts       from '../components/Toasts'
import ProblemsPage from './ProblemsPage'
import UsersPage    from './UsersPage'
import StatsPage    from './StatsPage'
import { useToast } from '../hooks/useToast'
import { makeApiFetch } from '../utils/apiFetch'
import { TOKEN_KEY, USER_KEY, API_KEY } from '../utils/constants'

export default function DashboardPage({ token, user, api, onLogout }) {
  const [tab,      setTab]      = useState('problems')
  const [sideOpen, setSideOpen] = useState(false)
  const { toasts, toast }       = useToast()

  const apiFetch = useCallback(
    makeApiFetch(api, token, () => {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(API_KEY)
      onLogout()
    }),
    [api, token, onLogout]
  )

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(API_KEY)
    onLogout()
  }

  const navTo = name => { setTab(name); setSideOpen(false) }

  return (
    <>
      <button className="hamburger" onClick={() => setSideOpen(o => !o)} aria-label="Toggle menu">
        <span /><span /><span />
      </button>
      <div className={`sidebar-overlay${sideOpen ? ' active' : ''}`} onClick={() => setSideOpen(false)} />
      <div className="layout">
        <Sidebar activeTab={tab} onNav={navTo} admin={user} onLogout={logout} isOpen={sideOpen} />
        <main className="content page-animate">
          {tab === 'problems' && <ProblemsPage apiFetch={apiFetch} toast={toast} />}
          {tab === 'users'    && <UsersPage    apiFetch={apiFetch} toast={toast} />}
          {tab === 'stats'    && <StatsPage    apiFetch={apiFetch} toast={toast} />}
        </main>
      </div>
      <Toasts toasts={toasts} />
    </>
  )
}
