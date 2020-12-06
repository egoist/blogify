import { Blog } from '@prisma/client'
import { prisma } from '@server/prisma'
import dayjs from 'dayjs'

export const postService = {
  async getPopularPosts(
    days = 30,
  ): Promise<
    Array<{
      title: string
      slug: string
      createdAt: string
      blogSlug: string
      blogName: string
      likesCount: number
    }>
  > {
    const posts: Array<{
      id: number
      blog_id: number
      score: number
      title: string
      slug: string
      created_at: Date
      likes_count: number
    }> = await prisma.$queryRaw`
    select *, (likes_count / EXTRACT(EPOCH FROM current_timestamp - created_at)/3600 ^ 1.8) as score from "posts"
    where created_at > ${dayjs().subtract(days, 'day').toDate()}
    order by score
    limit 30
    `
    const blogs: {
      [blog_id: number]: Blog
    } = await prisma.blog
      .findMany({
        where: {
          id: {
            in: posts.map((post) => post.blog_id),
          },
        },
      })
      .then((blogs) =>
        blogs.reduce((res, blog) => {
          return {
            ...res,
            [blog.id]: blog,
          }
        }, {}),
      )

    return posts.map((post) => {
      const blog = blogs[post.blog_id]
      return {
        title: post.title,
        slug: post.slug,
        createdAt: dayjs(post.created_at).format(),
        blogSlug: blog.slug,
        blogName: blog.name,
        likesCount: post.likes_count,
      }
    })
  },

  async isLikedBy(postId: number, userId: number) {
    const likes = await prisma.post
      .findUnique({
        select: {
          id: true,
        },
        where: {
          id: postId,
        },
      })
      .likes({
        where: {
          userId,
        },
      })

    return likes.length > 0
  },
}
