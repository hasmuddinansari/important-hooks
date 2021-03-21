/* eslint-disable no-undef */
/**
 * @useHelpSuggestionSearch allows Zen desk widget to query certain phrases on different dashboard pages
 * */

import { useEffect } from 'react'

export const useHelpSuggestionSearch = ({
  searchQuery = '',
  placeholder = '',
}) => {
  useEffect(() => {
    zE('webWidget', 'reset')
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          title: {
            'en-US': 'Help Center',
          },
          searchPlaceholder: {
            '*': placeholder,
          },
          suppress: false,
        },
      },
    })

    zE('webWidget', 'helpCenter:setSuggestions', {
      search: searchQuery,
    })
  }, [])
}

export default useHelpSuggestionSearch
