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
import Head from 'next/head'

type PageProps = {
  user: UserSession | null
  blog: BlogInfo
  isLiked: boolean | null
  canEdit: boolean
  excerpt: string
  post: {
    id: number
    title: string
    content: string
    createdAt: string
    slug: string
    likesCount: number
    cover: string | null
    coverAlt: string | null
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

  const canEdit = post.blog.userId === user?.id
  const isLiked =
    (user && (await postService.isLikedBy(post.id, user.id))) || null
  const { html, env } = renderMarkdown(post.content)
  // Strip HTML tags in excerpt
  const excerpt = env.excerpt.trim().replace(/(<([^>]+)>)/gi, '')
  return {
    props: {
      user,
      blog,
      isLiked,
      post: {
        ...post,
        content: html,
      },
      excerpt,
      canEdit,
    },
  }
}

const Post: React.FC<PageProps> = ({
  user,
  blog,
  post,
  isLiked,
  canEdit,
  excerpt,
}) => {
  return (
    <>
      <Head>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={excerpt} />
        {post.cover && <meta name="og:image" content={post.cover} />}
        <meta name="description" content={excerpt} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <BlogLayout blog={blog} title={post.title}>
        <div className="border-b border-border pb-3">
          <h2 className="text-gray-100 text-2xl">{post.title}</h2>
          <div className="mt-5 text-sm flex justify-between items-center">
            <div className="space-x-3">
              <span>{dayjs(post.createdAt).format('MMM DD, YYYY')}</span>
              {canEdit && (
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
        <div className="mt-8 text-gray-200">
          {post.cover && (
            <img className="post-cover" src={post.cover} alt="cover image" />
          )}
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div>
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
