import { useRef, useEffect, useState } from 'react'

export const IMAGE_STATUS_ENUM = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
}

export const useImage = ({ src, srcset, sizes }) => {
  const [status, setStatus] = useState(IMAGE_STATUS_ENUM.LOADING)
  const image = useRef(undefined)

  useEffect(() => {
    const unload = () => {
      if (image.current) {
        image.current.onload = null
        image.current.onerror = null
      }
    }

    image.current = new window.Image()
    if (image.current) {
      image.current.onload = () => {
        unload()
        setStatus(IMAGE_STATUS_ENUM.LOADED)
      }

      image.current.onerror = () => {
        unload()
        setStatus(IMAGE_STATUS_ENUM.ERROR)
      }

      image.current.sizes = sizes || ''
      image.current.srcset = srcset || ''
      image.current.src = src
    }

    return () => {
      unload()
      setStatus(IMAGE_STATUS_ENUM.LOADING)
    }
  }, [src, srcset, sizes])

  return {
    status,
    loading: status === IMAGE_STATUS_ENUM.LOADING,
    loaded: status === IMAGE_STATUS_ENUM.LOADED,
    error: status === IMAGE_STATUS_ENUM.ERROR,
    image: image.current,
  }
}
