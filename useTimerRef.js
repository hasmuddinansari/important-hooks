import { useRef, useState } from 'react'

const STATUS = {
  IDLE: 'IDLE',
  STARTED: 'STARTED',
  STOPPED: 'STOPPED',
}

export const useTimerRef = ({ maxTime, updater, updateBy = 1000 }) => {
  const [status, setStatus] = useState(STATUS.IDLE)
  const counterRef = useRef(0)
  const timerRef = useRef(null)

  const stop = callback => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    if (callback) {
      callback()
    }
    setStatus(STATUS.STOPPED)
  }

  const start = () => {
    setStatus(STATUS.STARTED)
    timerRef.current = setInterval(() => {
      counterRef.current += 1
      if (updater) {
        updater(counterRef.current)
      }
      if (maxTime === counterRef.current) {
        stop()
      }
    }, updateBy)
  }

  const reset = () => {
    counterRef.current = 0
    timerRef.current = null
    setStatus(STATUS.IDLE)
  }

  return { status, start, stop, reset }
}
