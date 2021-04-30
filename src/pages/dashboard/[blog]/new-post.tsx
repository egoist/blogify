import { getServerSession, UserSession } from '@server/auth'
import { GetServerSideProps } from 'next'
import React from 'react'
import { blogService } from '@server/services/blog.service'
import { PostEditor } from '@/components/PostEditor'
import { BlogInfo } from '@/components/layouts/BlogLayout'

type PageProps = {
  user: UserSession
  blog: BlogInfo
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

  return {
    props: {
      user,
      blog,
    },
  }
}

const NewPost: React.FC<PageProps> = ({ user, blog }) => {
  return <PostEditor user={user} blog={blog} />
}

export default NewPost
