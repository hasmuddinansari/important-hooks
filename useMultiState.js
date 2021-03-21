/**
 * @useMultiState is a custom hook allows to use the multiple state
 * */

import { useState } from 'react'

export default function useMultiState(initialState = {}) {
  const [state, updateState] = useState(() => initialState)

  const setState = newState => updateState(prev => ({ ...prev, ...newState }))

  return [state, setState]
}
