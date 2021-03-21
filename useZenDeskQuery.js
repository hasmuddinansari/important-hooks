import { useEffect } from 'react'
import { zendeskInstance } from 'utils/axios/zendeskInstance'
import { useMultiState } from './useMultiState'

const STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  ERROR: 'error',
  FETCHING_MORE: 'fetchingMore',
}

const { PENDING, SUCCESS, ERROR, FETCHING_MORE } = STATUS

export const useZenDeskQuery = ({
  searchString = '',
  startSearch = false,
  clearSearch = false,
  categoryId = '',
}) => {
  const [{ status, error, data, nextPageUrl }, setState] = useMultiState({
    status: '',
    error: false,
    data: null,
    nextPageUrl: '',
  })
  const queryURL = searchString
    ? `/api/v2/help_center/articles/search.json?per_page=10&query=${searchString}`
    : `api/v2/help_center/categories/${categoryId}/articles?per_page=10`

  const fetchMore = () => {
    if (nextPageUrl) {
      setState({ status: FETCHING_MORE })
      zendeskInstance
        .get(nextPageUrl)
        .then(res => {
          setState({
            status: 'success',
            data: categoryId
              ? [...data, ...res.data.articles]
              : [...data, ...res.data.results],
            nextPageUrl: res.data.next_page,
          })
        })
        .catch(() => setState({ status: ERROR, error: true }))
    }
  }

  useEffect(() => {
    if (startSearch || categoryId) {
      setState({ status: PENDING })
      zendeskInstance
        .get(queryURL)
        .then(res => {
          setState({
            status: SUCCESS,
            data: categoryId ? res.data.articles : res.data.results,
            nextPageUrl: res.data.next_page,
          })
        })
        .catch(err => setState({ status: ERROR, error: err.message }))
    }
  }, [startSearch, categoryId])

  useEffect(() => {
    if (clearSearch) {
      setState({ data: null })
    }
  }, [clearSearch])

  return { status, error, data, fetchMore, nextPageUrl }
}
