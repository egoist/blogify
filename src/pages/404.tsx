import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <>
      <Head>
        <title>404 Not Found</title>
      </Head>
      <div className="text-center flex items-center h-screen justify-center">
        <div>
          <h1 className="text-gray-100 font-bold">404 - Not Found</h1>
          <div className="mt-3">
            <Link href="/">
              <a className="link text-sm">Return Home</a>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFound
