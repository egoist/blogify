import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getServerSession, UserSession } from '@server/auth'

type PageProps = {
  user: UserSession | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  if (user) {
    return {
      redirect: {
        destination: `/dashboard`,
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
    },
  }
}

const Home: React.FC<PageProps> = ({ user }) => {
  return (
    <>
      <Head>
        <title>Blogify</title>
      </Head>
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div className="-mt-32">
          <h1 className="text-white text-8xl">Blogify</h1>
          <h2 className="text-3xl mt-8">Your minimalistic blogging platform</h2>
          <div className="mt-8">
            <a
              className="space-x-2 h-14 inline-flex rounded-lg border items-center text-xl px-5 hover:bg-bg-darker"
              href="/api/auth/github"
            >
              <svg width="1.2em" height="1.2em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 1A10.89 10.89 0 0 0 1 11.77A10.79 10.79 0 0 0 8.52 22c.55.1.75-.23.75-.52v-1.83c-3.06.65-3.71-1.44-3.71-1.44a2.86 2.86 0 0 0-1.22-1.58c-1-.66.08-.65.08-.65a2.31 2.31 0 0 1 1.68 1.11a2.37 2.37 0 0 0 3.2.89a2.33 2.33 0 0 1 .7-1.44c-2.44-.27-5-1.19-5-5.32a4.15 4.15 0 0 1 1.11-2.91a3.78 3.78 0 0 1 .11-2.84s.93-.29 3 1.1a10.68 10.68 0 0 1 5.5 0c2.1-1.39 3-1.1 3-1.1a3.78 3.78 0 0 1 .11 2.84A4.15 4.15 0 0 1 19 11.2c0 4.14-2.58 5.05-5 5.32a2.5 2.5 0 0 1 .75 2v2.95c0 .35.2.63.75.52A10.8 10.8 0 0 0 23 11.77A10.89 10.89 0 0 0 12 1"
                ></path>
              </svg>
              <span>Login via GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
