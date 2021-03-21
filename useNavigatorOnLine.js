import { useState, useEffect } from 'react'

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true

export default function useNavigatorOnLine() {
  const [isOnline, setIsOnline] = useState(() => getOnLineStatus())

  const setStatus = status => {
    setIsOnline(status)
  }

  useEffect(() => {
    window.addEventListener('online', () => setStatus(true))
    window.addEventListener('offline', () => setStatus(false))

    return () => {
      window.removeEventListener('online', () => setStatus(true))
      window.removeEventListener('offline', () => setStatus(false))
    }
  }, [])

  return { isOnline }
}
