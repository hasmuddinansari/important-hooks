/**
 * Documentation
 *
 * @description useFetchLazyQuery is a custom hook to enhance apollo useLazyQuery hook
 *
 * @param {Query}   query
 * @param {object}   queryOptions
 * @param {string}   QueryKey value from apollo response ex:`data.assessment` in this assessment is query
 * @param {string}   QueryConstructorMethod method available in factory
 * @param {boolean}  HasEdges boolean for relay based query
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
 * @returns{object} variables request and response variables
 * @returns{boolean} hasNextPage boolean value for pagination
 * @returns{number} totalCount is number
 * @returns{boolean} endCursor relay based cursor values for pagination
 * @returns{object} others it will have other object apollo values
 */

import { useState } from 'react'
import { useLazyQuery } from '@apollo/react-hooks'
import { hasValue } from 'utils'

export const useFetchLazyQuery = (query, queryOptions) => {
  const {
    QueryKey,
    QueryConstructor,
    QueryConstructorMethod = 'buildList',
    HasEdges = true,
    ...options
  } = queryOptions
  const [refetchLoading, setRefetchLoading] = useState(false)
  const [call, list] = useLazyQuery(query, options)
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch: apolloRefetch,
    variables,
    ...others
  } = list

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
  // eslint-disable-next-line camelcase
  const totalCount = data?.[QueryKey]?.total_count

  const { hasNextPage, hasPreviousPage, startCursor, endCursor } =
    data?.[QueryKey]?.pageInfo ?? {}

  return {
    call,
    data,
    loading,
    error,
    fetchMore,
    refetch,
    refetchLoading,
    [QueryKey]: HasEdges ? dataList : dataItem,
    buildedList: hasValue(buildedList) ? buildedList : undefined,
    variables,
    hasNextPage,
    hasPreviousPage,
    startCursor,
    endCursor,
    totalCount,

    ...others,
  }
}

export default useFetchLazyQuery
