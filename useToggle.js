/**
 * @useToggle hook allows to toggle the state
 * */

import { useState } from 'react'

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(() => initialState)

  const toggle = () => {
    setState(prevState => !prevState)
  }

  return [state, setState, toggle]
}

export default useToggle
