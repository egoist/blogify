import { GetServerSideProps } from 'next'
import { blogService } from '@server/services/blog.service'
import { getServerSession, UserSession } from '@server/auth'
import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import React from 'react'
import Link from 'next/link'

type PageProps = {
  user: UserSession
  blog: BlogInfo
  posts: { title: string; slug: string; date: string }[]
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const blog = await blogService.getBlogBySlug(ctx.query.blog as string)
  if (!blog) {
    return { notFound: true }
  }
  const posts = await blogService.getAllPosts(blog.id)
  return {
    props: {
      user,
      blog,
      posts,
    },
  }
}

export default function BlogDashboard({ blog, posts }: PageProps) {
  return (
    <BlogLayout blog={blog} title={`Dashboard - ${blog.name}`}>
      <h2 className="mb-5 text-2xl flex justify-between items-center">
        <span>All Post</span>
        <Link href={`/${blog.slug}/new-post`}>
          <a className="text-sm border rounded-lg px-3 h-7 inline-flex items-center hover:bg-bg-darker">
            New
          </a>
        </Link>
      </h2>
      <div className="space-y-3">
        {posts.map((post) => {
          return (
            <div key={post.slug}>
              <h2>
                <Link href={`/${blog.slug}/${post.slug}`}>
                  <a className="text-white font-bold text-lg">{post.title}</a>
                </Link>
              </h2>
              <div className="mt-1 space-x-3">
                <span>{post.date}</span>
                <Link href={`/${blog.slug}/${post.slug}/edit`}>
                  <a className="link">Edit</a>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </BlogLayout>
  )
}
