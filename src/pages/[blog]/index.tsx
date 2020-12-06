import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import { PostList } from '@/components/PostList'
import { getServerSession, UserSession } from '@server/auth'
import { renderMarkdown } from '@server/markdown'
import { prisma } from '@server/prisma'
import { blogService } from '@server/services/blog.service'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React from 'react'

type PageProps = {
  user: UserSession | null
  blog: BlogInfo
  introduction: string
  posts: Array<{
    title: string
    date: string
    slug: string
    cover: string | null
    coverAlt: string | null
    tags: Array<{
      name: string
      slug: string
    }>
  }>
  hasMore: boolean
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  const blog = await prisma.blog.findUnique({
    where: {
      slug: ctx.query.blog as string,
    },
  })
  if (!blog) {
    return { notFound: true }
  }
  const { posts, hasMore } = await blogService.getRecentPosts(blog.id)
  const introduction = renderMarkdown(blog.introduction)
  return {
    props: {
      user,
      blog: {
        name: blog.name,
        slug: blog.slug,
      },
      introduction: introduction.html,
      posts,
      hasMore,
    },
  }
}

const Blog: React.FC<PageProps> = ({
  user,
  blog,
  introduction,
  posts,
  hasMore,
}) => {
  return (
    <BlogLayout blog={blog}>
      {introduction && (
        <div
          className={clsx(`rich-content`, !user && `mb-12`)}
          dangerouslySetInnerHTML={{ __html: introduction }}
        ></div>
      )}
      {user && (
        <div className="mt-3 mb-12 text-sm">
          <Link href={`/${blog.slug}/settings`}>
            <a className="link inline-flex items-center space-x-1">
              <svg
                width="1em"
                height="1em"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
              <span>Edit</span>
            </a>
          </Link>
        </div>
      )}
      <h3 className="text-gray-100 flex justify-between">
        <span className="font-bold">Recent Posts</span>
        {user && (
          <Link href={`/${blog.slug}/new-post`}>
            <a className="link text-sm inline-flex items-center space-x-1">
              <svg
                width="1em"
                height="1em"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              <span>New Post</span>
            </a>
          </Link>
        )}
      </h3>
      {posts.length > 0 && <PostList posts={posts} blogSlug={blog.slug} />}
      {posts.length === 0 && <div className="text-sm">No posts yet.</div>}
      {hasMore && (
        <div className="mt-5">
          <Link href={`/${blog.slug}/archive`}>
            <a className="link">..all posts</a>
          </Link>
        </div>
      )}
    </BlogLayout>
  )
}

export default Blog
