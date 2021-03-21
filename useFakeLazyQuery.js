/**
 * Documentation
 *
 * @description useFakeQuery is a custom hook to similar to useFetchQuery for making mock queries
 *
 */

import { mocks } from 'utils/apollo/mocks'
import { hasValue } from 'utils'
import { useMultiState } from './useMultiState'

export const useFakeLazyQuery = (query, queryOptions = {}) => {
  const {
    QueryKey,
    NestedQueryKey,
    QueryConstructor,
    QueryConstructorMethod = 'buildList',
    ...others
  } = queryOptions
  const [{ data, loading, error }, setState] = useMultiState({
    data: undefined,
    loading: false,
    error: undefined,
  })

  const { variables, onComplete, onError } = others

  const call = ({ variables: callVariables = {} } = {}) => {
    setState({ loading: true })
    setState({
      variables: { ...variables, ...callVariables },
    })
    setTimeout(() => {
      const resolved = mocks.find(item => item.request.query === query)
      if (hasValue(resolved)) {
        setState({
          loading: false,
          error: undefined,
          data: resolved.result.data,
        })
        if (onComplete) {
          onComplete(resolved.result.data)
        }
      } else {
        const rejectError = new Error('data not found invalid mutation')
        setState({
          loading: false,
          error: rejectError,
          data: undefined,
        })
        if (onError) {
          onError(rejectError)
        }
      }
    }, 300)
  }

  const buildedList = NestedQueryKey
    ? QueryConstructor?.[QueryConstructorMethod](
        data?.[QueryKey]?.[NestedQueryKey] || [],
      )
    : QueryConstructor?.[QueryConstructorMethod](data?.[QueryKey] || [])

  // eslint-disable-next-line camelcase
  const totalCount = data?.[QueryKey]?.total_count

  const { hasNextPage, endCursor } = data?.[QueryKey]?.pageInfo ?? {}

  return {
    call,
    data,
    loading,
    error,
    buildedList: hasValue(buildedList) ? buildedList : undefined,
    hasNextPage,
    totalCount,
    endCursor,
    ...others,
  }
}
