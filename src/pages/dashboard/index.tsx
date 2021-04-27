import { getServerSession } from '@server/auth'
import { prisma } from '@server/prisma'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { user } = await getServerSession(ctx.req)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  let { lastActiveBlog } =
    (await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        lastActiveBlog: true,
      },
    })) || {}

  if (!lastActiveBlog) {
    const lastestBlog = await prisma.blog.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (!lastestBlog) {
      return {
        redirect: {
          destination: '/new-blog',
          permanent: false,
        },
      }
    }
    lastActiveBlog = lastestBlog
  }

  return {
    redirect: {
      destination: `/dashboard/${lastActiveBlog.slug}`,
      permanent: false,
    },
  }
}

export default function () {}
