import { getServerSession, UserSession } from '@server/auth'
import { GetServerSideProps } from 'next'
import React from 'react'
import { blogService } from '@server/services/blog.service'
import { PostEditor } from '@/components/PostEditor'
import { BlogInfo } from '@/components/layouts/BlogLayout'

type PageProps = {
  user: UserSession
  initialTitle: string
  initialContent: string
  initialTags: string
  initialSlug: string
  initialCover: string | null
  blog: BlogInfo
  postId: number
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

  const post =
    blog && (await blogService.getPostBySlug(blog.id, ctx.query.post as string))

  if (!blog || !post) {
    return { notFound: true }
  }

  return {
    props: {
      user,
      initialTitle: post.title,
      initialContent: post.content,
      initialTags: post.tags.map((tag: any) => tag.name).join(', '),
      initialSlug: post.slug,
      initialCover: post.cover,
      blog: {
        name: blog.name,
        slug: blog.slug,
      },
      postId: post.id,
    },
  }
}

const EditPost: React.FC<PageProps> = ({
  user,
  initialTitle,
  initialContent,
  initialTags,
  initialSlug,
  blog,
  postId,
}) => {
  return (
    <PostEditor
      user={user}
      initialTitle={initialTitle}
      initialContent={initialContent}
      initialTags={initialTags}
      initialSlug={initialSlug}
      blog={blog}
      postId={postId}
    />
  )
}

export default EditPost
