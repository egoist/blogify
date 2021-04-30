import { getServerSession, UserSession } from '@server/auth'
import { GetServerSideProps } from 'next'
import React from 'react'
import { blogService } from '@server/services/blog.service'
import { PostEditor } from '@/components/PostEditor'
import { BlogInfo } from '@/components/layouts/BlogLayout'

type PageProps = {
  user: UserSession
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

  if (!blog) {
    return { notFound: true }
  }

  const postId = parseInt(ctx.query.post as string, 10)

  return {
    props: {
      user,
      blog,
      postId,
    },
  }
}

const EditPost: React.FC<PageProps> = ({ user, blog, postId }) => {
  return <PostEditor user={user} blog={blog} postId={postId} />
}

export default EditPost
