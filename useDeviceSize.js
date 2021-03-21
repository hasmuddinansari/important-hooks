/**
 * @useDeviceSize hook returns the width and height of device
 * */

import { useState, useEffect } from 'react'

function getDeviceSize() {
  const { innerWidth: width, innerHeight: height } = window
  return { width, height }
}

export default function useDeviceSize() {
  const [size, setSize] = useState(getDeviceSize())

  useEffect(() => {
    const handleResize = () => {
      setSize(getDeviceSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}
