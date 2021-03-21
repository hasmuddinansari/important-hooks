/**
 * Documentation
 *
 * @description useFetchQuery is a custom hook to enhance apollo useQuery hook
 *
 * @param {Query}   query
 * @param {object}   queryOptions
 * @param {string}   QueryKey value from apollo response ex:`data.assessment` in this assessment is query
 * @param {string}   QueryConstructorMethod method available in factory
 * @param {boolean}  HasEdges boolean for relay based query
 * @param {boolean}  NestedQueryKey value a nested key from apollo response ex: `data.applicant.responses`
 *
 * @returns {string} recordingType
 *
 * @returns{function} call is function to make network query
 * @returns{object} data object query response
 * @returns{boolean} loading response loading status
 * @returns{Error} error response status
 * @returns{function} fetchMore request function
 * @returns{function} refetch request function
 * @returns{boolean} refetchLoading response loading status
 * @returns{object | array} buildedList formatted response values
 * @returns{object | array} builtNestedList formatted response values from a nested response query
 * @returns{object} variables request and response variables
 * @returns{boolean} hasNextPage boolean value for pagination
 * @returns{number} totalCount is number
 * @returns{boolean} endCursor relay based cursor values for pagination
 */

import { useState } from 'react'
import { useQuery } from '@apollo/react-hooks'

export const useFetchQuery = (query, queryOptions) => {
  const {
    QueryKey,
    NestedQueryKey,
    QueryConstructor,
    QueryConstructorMethod = 'buildList',
    HasEdges = true,
    ...options
  } = queryOptions
  const [refetchLoading, setRefetchLoading] = useState(false)
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch: apolloRefetch,
    variables,
  } = useQuery(query, options)

  const refetch = refetchVariables => {
    if (!loading) {
      setRefetchLoading(true)
      const refetchPromise = refetchVariables
        ? apolloRefetch(refetchVariables)
        : apolloRefetch()
      refetchPromise.finally(() => {
        setRefetchLoading(false)
      })
    }
  }

  const dataList = QueryKey && HasEdges ? data?.[QueryKey]?.edges : []
  const dataItem = QueryKey && !HasEdges ? data?.[QueryKey] : {}

  const buildedList = QueryConstructor?.[QueryConstructorMethod](
    HasEdges ? dataList : dataItem,
  )

  const builtNestedList = NestedQueryKey
    ? QueryConstructor?.[QueryConstructorMethod](
        data?.[QueryKey]?.[NestedQueryKey] || [],
      )
    : buildedList
  // eslint-disable-next-line camelcase
  const totalCount = data?.[QueryKey]?.total_count

  const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
    data?.[QueryKey]?.pageInfo ?? {}

  return {
    data,
    loading,
    error,
    fetchMore,
    refetch,
    refetchLoading,
    [QueryKey]: HasEdges ? dataList : dataItem,
    buildedList,
    builtNestedList,
    variables,
    hasNextPage,
    totalCount,
    endCursor,
    hasPreviousPage,
    startCursor,
  }
}

export default useFetchQuery
