import Link from 'next/link'
import React from 'react'

export const PostList: React.FC<{
  posts: Array<{
    title: string
    slug: string
    date: string
    cover?: string | null
    coverAlt?: string | null
  }>
  blogSlug: string
}> = ({ posts, blogSlug }) => {
  return (
    <div>
      {posts.map((post) => {
        const postLink = `/${blogSlug}/${post.slug}`
        return (
          <div
            key={post.slug}
            className="flex justify-between flex-col-reverse md:flex-row border-b border-border py-8"
          >
            <div>
              <Link href={postLink}>
                <a className="link hint-visited text-2xl">{post.title}</a>
              </Link>
              <div className="mt-3 text-sm">{post.date}</div>
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
  )
}
