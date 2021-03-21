/**
 * @useFetchHTML used to fetch HTML file from API
 * */

import { useState, useEffect } from 'react'
import axios from 'axios'

export const useFetchHTML = sourceURL => {
  const [htmlMarkup, setHTMLMarkup] = useState('')

  useEffect(() => {
    const fetchHTML = async () => {
      const result = await axios.get(sourceURL)
      setHTMLMarkup(result.data)
    }
    fetchHTML()
  }, [])

  return [htmlMarkup]
}

export default useFetchHTML
