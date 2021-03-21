/**
 * Documentation
 *
 * @description useIntersectionObserver is a custom hook to utilize IntersectionObserver
 *
 * @param {HTMLElement}   ref
 * @param {string}        rootMargin
 * @param {array}         threshold
 *
 * @returns {string} recordingType
 *
 * @returns{boolean} isIntersecting is boolean
 */

import { useEffect, useState } from 'react'

export const useIntersectionObserver = ({
  ref,
  rootMargin = `0px`,
  threshold = [0.5],
}) => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      {
        rootMargin,
        threshold,
      },
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, []) // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting
}

export default useIntersectionObserver
