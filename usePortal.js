import { useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * @usePortal Hook creates a Root level element and renders child elements within it.
 * @param {string} id - the parent div that the portal will append to
 * */

export const usePortal = id => {
  const portalElement = useRef(document.createElement('div'))
  portalElement.current.setAttribute('id', 'overlay-root')
  const parentElement = document.querySelector(`#${id}`)

  useEffect(() => {
    parentElement.appendChild(portalElement.current)

    return () => parentElement.removeChild(portalElement.current)
  })

  return {
    Portal: ({ children }) => createPortal(children, portalElement.current),
  }
}
