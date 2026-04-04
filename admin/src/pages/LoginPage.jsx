import { useState } from 'react'
import { DEFAULT_API, TOKEN_KEY, USER_KEY, API_KEY } from '../utils/constants'


export default function LoginPage({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const doLogin = async () => {
    setError('')
    if (!email || !password) { setError('Please fill all fields.'); return }
    setLoading(true)

    try {
      const res  = await fetch(`${DEFAULT_API}/api/users/admin-login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok)          { setError(data.error || 'Login failed'); return }
      if (!data.user.isAdmin) { setError('Not an admin account.');    return }

      // ── Persist token permanently (no expiry) ──────────────────────────
      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY,  JSON.stringify(data.user))
      localStorage.setItem(API_KEY,   DEFAULT_API)

      onLogin(data.token, data.user, DEFAULT_API)
    } catch {
      setError('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => { if (e.key === 'Enter') doLogin() }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">CodeForge Admin</div>
        <h2>Admin Sign In</h2>
        <p className="login-sub">Enter your admin credentials to continue</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input
            className="input" type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKey}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            className="input" type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={onKey}
          />
        </div>

        <button className="btn btn-primary w-full" onClick={doLogin} disabled={loading}>
          {loading ? <><span className="spinner" /> Signing in…</> : 'Sign In'}
        </button>
      </div>
    </div>
  )
}
