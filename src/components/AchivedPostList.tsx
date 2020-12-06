import Link from 'next/link'
import React from 'react'

export const ArchivedPostList: React.FC<{
  posts: Array<{ title: string; slug: string; date: string }>
  blogSlug: string
}> = ({ posts, blogSlug }) => {
  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.slug} className="">
            <span>{post.date}</span>
            <span className="mx-2">»</span>
            <Link href={`/${blogSlug}/${post.slug}`}>
              <a className="link hint-visited">{post.title}</a>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
