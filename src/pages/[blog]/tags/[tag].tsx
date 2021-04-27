import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import { PostList } from '@/components/PostList'
import { getServerSession, UserSession } from '@server/auth'

import { prisma } from '@server/prisma'
import { blogService } from '@server/services/blog.service'
import { GetServerSideProps } from 'next'

type PageProps = {
  blog: BlogInfo
  tagName: string
  posts: {
    data: Array<{
      title: string
      slug: string
      date: string
      excerpt: string
      cover?: string | null
      coverAlt?: string | null
      tags: Array<{
        name: string
        slug: string
      }>
    }>
    hasOlder: boolean
    hasNewer: boolean
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const blogSlug = ctx.query.blog as string
  const blog = await blogService.getBlogBySlug(blogSlug)
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
  const page = parseInt((ctx.query.page as string) || '1')
  const posts = await blogService.getPosts(blog.id, { tag: tagSlug, page })
  return {
    props: {
      blog,
      tagName: tag.name,
      posts,
    },
  }
}

const TagsPage: React.FC<PageProps> = ({ blog, tagName, posts }) => {
  return (
    <BlogLayout blog={blog} title={`Tag: ${tagName}`}>
      <h2 className="page-title">Posts in: #{tagName}</h2>
      <PostList posts={posts} blogSlug={blog.slug} />
    </BlogLayout>
  )
}

export default TagsPage
