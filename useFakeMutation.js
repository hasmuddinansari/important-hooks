/**
 * Documentation
 *
 * @description useFakeMutation is a custom hook to similar to useMutation for making mock mutation
 *
 */

import { mocks } from 'utils/apollo/mocks'
import { hasValue } from 'utils'
import { useMultiState } from './useMultiState'

export const useFakeMutation = (query, options) => {
  const { variables: optionVariables, onComplete, onError } = options
  const [{ data, loading, error, variables }, setState] = useMultiState({
    data: undefined,
    loading: false,
    error: undefined,
    variables: optionVariables,
  })

  const call = ({ variables: callVariables = {} }) => {
    setState({
      variables: { ...variables, ...callVariables },
    })
    setState({ loading: true })
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

  return [
    call,
    {
      data,
      options,
      loading,
      error,
      variables,
    },
  ]
}
