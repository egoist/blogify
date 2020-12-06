import { ArchivedPostList } from '@/components/AchivedPostList'
import { BlogLayout } from '@/components/layouts/BlogLayout'
import { Blog, Post } from '@prisma/client'
import { prisma } from '@server/prisma'
import { blogService } from '@server/services/blog.service'
import { GetServerSideProps } from 'next'

type PageProps = {
  blog: {
    name: string
    slug: string
  }
  posts: Array<{
    title: string
    date: string
    slug: string
  }>
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const blog = await prisma.blog.findUnique({
    where: {
      slug: ctx.query.blog as string,
    },
  })
  if (!blog) {
    return {
      notFound: true,
    }
  }
  const posts = await blogService.getAllPosts(blog.id)
  return {
    props: {
      blog: {
        name: blog.name,
        slug: blog.slug,
      },
      posts,
    },
  }
}

const Archives: React.FC<PageProps> = ({ blog, posts }) => {
  return (
    <BlogLayout blog={blog} title={`Archives`}>
      <h2 className="page-title">Archives</h2>
      <ArchivedPostList blogSlug={blog.slug} posts={posts} />
    </BlogLayout>
  )
}

export default Archives
