import { useState } from 'react'
import LoginPage     from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import { TOKEN_KEY, USER_KEY, API_KEY, DEFAULT_API } from './utils/constants'

export default function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const user  = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
    const api   = localStorage.getItem(API_KEY) || DEFAULT_API
    return token && user ? { token, user, api } : null
  })

  return auth ? (
    <DashboardPage
      token={auth.token}
      user={auth.user}
      api={auth.api}
      onLogout={() => setAuth(null)}
    />
  ) : (
    <LoginPage
      onLogin={(token, user, api) => setAuth({ token, user, api })}
    />
  )
}
