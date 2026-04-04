
export function makeApiFetch(api, token, onUnauth) {
  return async function apiFetch(path, options = {}) {
    const res = await fetch(`${api}${path}`, {
      ...options,
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })

    const data = await res.json()

    if (res.status === 401 || (data.error && /invalid|expired/i.test(data.error))) {
      onUnauth()
      return
    }

    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
    return data
  }
}
