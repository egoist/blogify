import { prisma } from '@server/prisma'
import dayjs from 'dayjs'

export const blogService = {
  async getBlogsByUser(userId: number) {
    const blogs = await prisma.blog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return blogs
  },

  async hasBlog(userId: number) {
    const blog = await prisma.blog.findFirst({
      where: {
        userId,
      },
    })
    return Boolean(blog)
  },

  async getBlogBySlug(slug: string) {
    const blog = await prisma.blog.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        introduction: true,
        user: {
          select: {
            id: true,
            avatar: true,
          },
        },
      },
    })

    return blog
  },

  async getPosts(
    blogId: number,
    { tag, limit, page }: { tag?: string; limit?: number; page?: number } = {},
  ) {
    limit = limit || 20
    page = page || 1
    const posts = await prisma.post.findMany({
      where: {
        blogId,
        deletedAt: null,
        tags: tag
          ? {
              some: {
                slug: tag,
              },
            }
          : undefined,
      },
      take: limit + 1,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tags: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    })

    return {
      data: posts.slice(0, limit).map((post) => {
        return {
          title: post.title,
          excerpt: post.excerpt,
          date: dayjs(post.createdAt).format('MMM DD, YYYY'),
          slug: post.slug,
          cover: post.cover,
          coverAlt: post.coverAlt,
          tags: post.tags,
        }
      }),
      hasOlder: posts.length > limit,
      hasNewer: page > 1,
    }
  },

  async getAllPosts(blogId: number, tagSlug?: string) {
    const posts = await prisma.post.findMany({
      where: {
        blogId,
        deletedAt: null,
        tags: tagSlug
          ? {
              some: {
                slug: tagSlug,
              },
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return posts.slice(0, 10).map((post) => {
      return {
        title: post.title,
        date: dayjs(post.createdAt).format('MMM DD, YYYY'),
        slug: post.slug,
      }
    })
  },

  async getPostBySlug(blogId: number, slug: string) {
    const post = await prisma.post.findFirst({
      where: {
        blogId,
        slug,
        deletedAt: null,
      },
      include: {
        tags: true,
        blog: {
          select: {
            userId: true,
          },
        },
      },
    })
    return post
  },
}
