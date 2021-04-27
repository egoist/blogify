import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const PostList: React.FC<{
  posts: {
    data: Array<{
      title: string
      slug: string
      date: string
      excerpt: string
      cover?: string | null
      coverAlt?: string | null
      tags: Array<{
        name: string
        slug: string
      }>
    }>
    hasOlder: boolean
    hasNewer: boolean
  }
  blogSlug: string
}> = ({ posts, blogSlug }) => {
  const router = useRouter()
  const page = parseInt((router.query.page as string) || '1')
  return (
    <div>
      <div className="space-y-5">
        {posts.data.map((post) => {
          const postLink = `/${blogSlug}/${post.slug}`
          return (
            <div
              key={post.slug}
              className="flex justify-between flex-col-reverse md:flex-row border rounded-lg p-5 md:p-8 shadow"
            >
              <div>
                <h2 className="-mt-1">
                  <Link href={postLink}>
                    <a className="font-bold text-3xl text-gray-200 hover:text-white">
                      {post.title}
                    </a>
                  </Link>
                </h2>
                <div className="mt-2 text-sm">{post.date}</div>
                {post.excerpt && (
                  <div className="mt-4">
                    {post.excerpt.length > 200
                      ? `${post.excerpt.slice(0, 200)}...`
                      : post.excerpt}
                  </div>
                )}
              </div>
              <div className="mb-5 md:mb-0 md:ml-5">
                {post.cover && (
                  <Link href={postLink}>
                    <a>
                      <img
                        style={{ maxWidth: '180px', maxHeight: '180px' }}
                        src={post.cover}
                        alt={post.coverAlt || 'post image'}
                      />
                    </a>
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-5 space-x-3">
        {posts.hasOlder && (
          <Link
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                page: page + 1,
              },
            }}
          >
            <a className="hover:text-white">« See Older</a>
          </Link>
        )}
        {posts.hasNewer && (
          <Link
            href={{
              pathname: router.pathname,
              query: {
                ...router.query,
                page: page - 1,
              },
            }}
          >
            <a className="hover:text-white">See Newer »</a>
          </Link>
        )}
      </div>
    </div>
  )
}
