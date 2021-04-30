import { AppLayout } from '@/components/layouts/AppLayout'
import { getServerSession, UserSession } from '@server/auth'
import { blogService } from '@server/services/blog.service'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

type PageProps = {
  user: UserSession
  blogs: Array<{
    slug: string
    name: string
    createdAt: string
  }>
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
  const blogs = await blogService.getBlogsByUser(user.id)
  if (blogs.length === 0) {
    return {
      redirect: {
        destination: '/new-blog',
        permanent: false,
      },
    }
  }
  return {
    props: {
      user,
      blogs: blogs.map((blog) => ({
        slug: blog.slug,
        name: blog.name,
        createdAt: blog.createdAt.toISOString(),
      })),
    },
  }
}

const Blogs: React.FC<PageProps> = ({ user, blogs }) => {
  return (
    <AppLayout title="Blogs">
      <div className="mb-5">
        <Link href="/new-blog">
          <a className="link">Create A New Blog →</a>
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {blogs.map((blog) => {
          return (
            <div
              key={blog.slug}
              className="border border-button-border rounded-lg p-5"
            >
              <h3 className="text-2xl text-gray-200">
                <Link href={`/${blog.slug}/dashboard`}>
                  <a>{blog.name}</a>
                </Link>
              </h3>
              <div className="mt-3 text-sm space-x-3">
                <Link href={`/${blog.slug}`}>
                  <a className="link">View</a>
                </Link>
                <Link href={`/${blog.slug}/new-post`}>
                  <a className="link">New Post</a>
                </Link>
                <Link href={`/${blog.slug}/settings`}>
                  <a className="link">Settings</a>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}

export default Blogs
