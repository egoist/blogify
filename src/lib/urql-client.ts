import {
  createClient,
  dedupExchange,
  cacheExchange,
  fetchExchange,
  ssrExchange,
  Client,
} from '@urql/core'
import React from 'react'

const isServerSide = !process.browser

let urqlClient: Client | undefined

const createUrqlClient = (initialState?: any) => {
  // The `ssrExchange` must be initialized with `isClient` and `initialState`
  const ssr = ssrExchange({
    isClient: !isServerSide,
    initialState: isServerSide ? undefined : initialState,
  })
  return createClient({
    url: `/api/graphql`,
    fetchOptions: {
      credentials: 'same-origin',
    },
    exchanges: [
      dedupExchange,
      cacheExchange,
      ssr, // Add `ssr` in front of the `fetchExchange`
      fetchExchange,
    ],
  })
}

const initializeUrqlClient = (initialState?: any) => {
  const client = urqlClient || createUrqlClient(initialState)

  // For SSG and SSR always create a new Apollo Client
  if (isServerSide) return client
  // Create the Urql Client only once in the client
  if (!urqlClient) urqlClient = client

  return client
}

export const getUrqlClient = (initialState?: any) => {
  const store = React.useMemo(() => initializeUrqlClient(initialState), [
    initialState,
  ])
  return store
}
