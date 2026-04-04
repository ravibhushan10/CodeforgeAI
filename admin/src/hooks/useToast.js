import { useState, useRef, useCallback } from 'react'


export function useToast() {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  const toast = useCallback((msg, type = 'info') => {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return { toasts, toast }
}
