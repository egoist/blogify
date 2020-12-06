import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import { getServerSession, UserSession } from '@server/auth'
import { blogService } from '@server/services/blog.service'
import { GetServerSideProps } from 'next'
import dayjs from 'dayjs'
import { renderMarkdown } from '@server/markdown'
import React from 'react'
import Link from 'next/link'
import { LikeButton } from '@/components/LikeButton'
import { postService } from '@server/services/post.service'

type PageProps = {
  user: UserSession | null
  blog: BlogInfo
  isLiked: boolean | null
  post: {
    id: number
    title: string
    content: string
    createdAt: string
    slug: string
    likesCount: number
    tags: Array<{
      id: number
      name: string
      slug: string
    }>
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  const blog = await blogService.getBlogBySlug(ctx.query.blog as string)

  const post =
    blog && (await blogService.getPostBySlug(blog.id, ctx.query.post as string))

  if (!blog || !post) {
    return { notFound: true }
  }

  const isLiked =
    (user && (await postService.isLikedBy(post.id, user.id))) || null
  const { html } = renderMarkdown(post.content)

  return {
    props: {
      user,
      blog,
      isLiked,
      post: {
        ...post,
        content: html,
      },
    },
  }
}

const Post: React.FC<PageProps> = ({ user, blog, post, isLiked }) => {
  return (
    <>
      <BlogLayout blog={blog} title={post.title}>
        <div className="border-b border-border pb-3">
          <h2 className="text-gray-100 text-2xl">{post.title}</h2>
          <div className="mt-5 text-sm flex justify-between items-center">
            <div className="space-x-3">
              <span>{dayjs(post.createdAt).format('MMM DD, YYYY')}</span>
              {user && (
                <>
                  <span>
                    <Link href={`/${blog.slug}/${post.slug}/edit`}>
                      <a className="link">Edit</a>
                    </Link>
                  </span>
                </>
              )}
            </div>
            <div className="space-x-1">
              {post.tags.map((tag, index: number) => {
                return (
                  <span key={tag.id}>
                    <Link href={`/${blog.slug}/tags/${tag.slug}`}>
                      <a className="link">{tag.name}</a>
                    </Link>
                    {index !== post.tags.length - 1 && ','}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
        <div
          className="mt-8 text-gray-200 rich-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <div className="mt-10">
          <LikeButton
            count={post.likesCount}
            postId={post.id}
            hasLogin={Boolean(user)}
            isLiked={Boolean(isLiked)}
          />
        </div>
      </BlogLayout>
    </>
  )
}

export default Post
