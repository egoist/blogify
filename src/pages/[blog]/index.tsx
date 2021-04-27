import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import { PostList } from '@/components/PostList'
import { getServerSession, UserSession } from '@server/auth'
import { renderMarkdown } from '@server/markdown'
import { blogService } from '@server/services/blog.service'
import clsx from 'clsx'
import { GetServerSideProps } from 'next'
import React from 'react'

type PageProps = {
  user: UserSession | null
  blog: BlogInfo
  introduction: string
  posts: {
    data: Array<{
      title: string
      date: string
      slug: string
      cover: string | null
      coverAlt: string | null
      excerpt: string
      tags: Array<{
        name: string
        slug: string
      }>
    }>
    hasOlder: boolean
    hasNewer: boolean
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  const blog = await blogService.getBlogBySlug(ctx.query.blog as string)
  if (!blog) {
    return { notFound: true }
  }
  const page = parseInt((ctx.query.page as string) || '1')
  const posts = await blogService.getPosts(blog.id, { page })
  const introduction = renderMarkdown(blog.introduction)
  return {
    props: {
      user,
      blog,
      introduction: introduction.html,
      posts,
    },
  }
}

const Blog: React.FC<PageProps> = ({ blog, introduction, posts }) => {
  return (
    <BlogLayout blog={blog} title={blog.name}>
      {introduction && (
        <div
          className={clsx(`rich-content`, `mb-12`)}
          dangerouslySetInnerHTML={{ __html: introduction }}
        ></div>
      )}
      <PostList posts={posts} blogSlug={blog.slug} />
    </BlogLayout>
  )
}

export default Blog
