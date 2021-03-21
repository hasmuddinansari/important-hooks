/**
 * Documentation
 *
 * @description useMultiSelector is a custom hook to select multiple values from selectors
 * @param {object} selectors {businessId:makeSelectBusinessId}
 * @returns {object} values {businessId:1}
 */

import { useSelector } from 'react-redux'

export const useMultiSelector = selectors => {
  const keys = Object.keys(selectors)
  const values = useSelector(state => {
    const selected = {}
    keys.forEach(key => {
      const selectorFunction = selectors[key]
      if (typeof selectorFunction !== 'function') {
        throw Error(`${selectorFunction} is not a function`)
      }
      selected[key] = selectorFunction(state)(state)
    })
    return selected
  })

  return values
}
