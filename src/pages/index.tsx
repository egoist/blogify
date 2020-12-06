import React from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getServerSession, UserSession } from '@server/auth'
import { AppLayout } from '@/components/layouts/AppLayout'
import { postService } from '@server/services/post.service'
import dayjs from 'dayjs'
import Link from 'next/link'

import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type PageProps = {
  user: UserSession | null
  popularPosts: Array<{
    title: string
    slug: string
    date: string
    blogSlug: string
    blogName: string
    likesCount: number
  }>
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  const popularPosts = await postService.getPopularPosts()

  return {
    props: {
      user,
      popularPosts: popularPosts.map((post) => {
        return {
          title: post.title,
          slug: post.slug,
          date: dayjs(post.createdAt).fromNow(true),
          blogSlug: post.blogSlug,
          blogName: post.blogName,
          likesCount: post.likesCount,
        }
      }),
    },
  }
}

const Home: React.FC<PageProps> = ({ user, popularPosts }) => {
  return (
    <>
      <Head>
        <title>Blogify</title>
      </Head>
      <AppLayout user={user}>
        <div className="space-y-8">
          {popularPosts.map((post) => {
            return (
              <div key={post.slug}>
                <h2>
                  <Link href={`/${post.blogSlug}/${post.slug}`}>
                    <a className="link hint-visited">{post.title}</a>
                  </Link>
                </h2>
                <div className="mt-2 text-xs space-x-2">
                  {post.likesCount > 0 && <span>{post.likesCount} likes,</span>}
                  <span>
                    by{' '}
                    <Link href={`/${post.blogSlug}`}>
                      <a className="hover:text-white">{post.blogName}</a>
                    </Link>
                    ,
                  </span>
                  <span>{post.date}</span>
                </div>
              </div>
            )
          })}
        </div>
      </AppLayout>
    </>
  )
}

export default Home
