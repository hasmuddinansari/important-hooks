/**
 * @useOutSideClassNameClick hook allows to detect clicks outside of a specified element or element ClassName
 * */

import { useEffect } from 'react'

export const useOutSideClassNameClick = (ref, fn, className) => {
  useEffect(() => {
    const listener = e => {
      if (className) {
        const isClassName = e.path
          .map(name => {
            if (name?.className?.toString().includes(className)) {
              return true
            }
            return false
          })
          .some(checkName => checkName === true)
        if (isClassName) {
          return
        }
        fn()
      } else {
        if (!ref?.current || ref?.current?.contains(e.target)) {
          return
        }
        fn()
      }
    }

    document.addEventListener('mousedown', listener, false)
    document.addEventListener('touchstart', listener, false)

    return () => {
      document.removeEventListener('mousedown', listener, false)
      document.removeEventListener('touchstart', listener, false)
    }
  }, [ref, className, fn])
}

export default useOutSideClassNameClick
