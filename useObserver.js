/**
 * Documentation
 *
 * @description useObserver is a custom hook to in case useIntersectionObserver not working use this hook.
 
 * @param {HTMLElement}   ref
 * @param {string}        rootMargin
 * @param {array}         threshold
 *
 *
 * @returns{boolean} isIntersecting is boolean,
 * @returns{function} setRef to pass target dom.
 */
import { useEffect, useState } from 'react'

export const useObserver = options => {
  const { threshold = 0.5, rootMargin = `0px` } = options ?? {}
  const [ref, setRef] = useState(null)
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      { threshold, rootMargin },
    )

    if (ref) {
      observer.observe(ref)
    }
    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [ref, options])

  return [isIntersecting, setRef]
}

export default useObserver
