/**
 * @useOutsideClick hook allows to detect clicks outside of a specified element
 * */

import { useEffect } from 'react'

export default function useOutsideClick(ref, fn) {
  useEffect(() => {
    const listener = e => {
      if (!ref.current || ref.current.contains(e.target)) {
        return
      }
      fn()
    }

    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, fn])
}
