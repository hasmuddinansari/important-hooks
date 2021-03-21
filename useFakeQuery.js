/**
 * Documentation
 *
 * @description useFakeQuery is a custom hook to similar to useFetchQuery for making mock queries
 *
 */

import { useEffect } from 'react'
import { mocks } from 'utils/apollo/mocks'
import { hasValue } from 'utils'
import { useMultiState } from './useMultiState'

export const useFakeQuery = (query, queryOptions) => {
  const {
    QueryKey,
    NestedQueryKey,
    QueryConstructor,
    QueryConstructorMethod = 'buildList',
    ...options
  } = queryOptions
  const [{ data, loading, error }, setState] = useMultiState({
    data: undefined,
    options,
    loading: true,
    error: undefined,
  })

  useEffect(() => {
    setTimeout(() => {
      const resolved = mocks.find(item => item.request.query === query)
      if (hasValue(resolved)) {
        setState({
          loading: false,
          error: undefined,
          data: resolved.result.data,
        })
      } else {
        setState({
          loading: false,
          error: new Error('data not found invalid query'),
          data: undefined,
        })
      }
    }, 300)
  }, [])

  const buildedList = NestedQueryKey
    ? QueryConstructor?.[QueryConstructorMethod](
        data?.[QueryKey]?.[NestedQueryKey] || [],
      )
    : QueryConstructor?.[QueryConstructorMethod](data?.[QueryKey] || [])

  // eslint-disable-next-line camelcase
  const totalCount = data?.[QueryKey]?.total_count

  const { hasNextPage, endCursor } = data?.[QueryKey]?.pageInfo ?? {}

  return {
    data,
    options,
    loading,
    error,
    buildedList: hasValue(buildedList) ? buildedList : undefined,
    hasNextPage,
    totalCount,
    endCursor,
  }
}
