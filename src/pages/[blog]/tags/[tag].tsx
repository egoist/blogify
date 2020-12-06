import { ArchivedPostList } from '@/components/AchivedPostList'
import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import { getServerSession, UserSession } from '@server/auth'

import { prisma } from '@server/prisma'
import { blogService } from '@server/services/blog.service'
import { GetServerSideProps } from 'next'

type PageProps = {
  user: UserSession | null
  blog: BlogInfo
  tagName: string
  posts: Array<{
    title: string
    date: string
    slug: string
  }>
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  const blog = await prisma.blog.findUnique({
    where: {
      slug: ctx.query.blog as string,
    },
  })
  if (!blog) {
    return { notFound: true }
  }
  const tagSlug = ctx.query.tag as string
  const tag = await prisma.tag.findFirst({
    where: {
      blogId: blog.id,
      slug: tagSlug,
    },
  })
  if (!tag) {
    return { notFound: true }
  }
  const posts = await blogService.getAllPosts(blog.id, tagSlug)
  return {
    props: {
      user,
      blog: {
        name: blog.name,
        slug: blog.slug,
      },
      tagName: tag.name,
      posts,
    },
  }
}

const TagsPage: React.FC<PageProps> = ({ blog, tagName, posts }) => {
  return (
    <BlogLayout blog={blog} title={`Tag: ${tagName}`}>
      <h2 className="page-title">Tag: {tagName}</h2>
      <ArchivedPostList posts={posts} blogSlug={blog.slug} />
    </BlogLayout>
  )
}

export default TagsPage
