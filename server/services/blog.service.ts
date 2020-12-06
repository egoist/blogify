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
    })

    return (
      blog && {
        id: blog.id,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
        slug: blog.slug,
        introduction: blog.introduction,
        name: blog.name,
      }
    )
  },

  async getRecentPosts(blogId: number) {
    const posts = await prisma.post.findMany({
      where: {
        blogId,
      },
      take: 11,
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
      posts: posts.slice(0, 10).map((post) => {
        return {
          title: post.title,
          date: dayjs(post.createdAt).format('MMM DD, YYYY'),
          slug: post.slug,
          cover: post.cover,
          coverAlt: post.coverAlt,
          tags: post.tags,
        }
      }),
      hasMore: posts.length > 10,
    }
  },

  async getAllPosts(blogId: number, tagSlug?: string) {
    const posts = await prisma.post.findMany({
      where: {
        blogId,
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
    return (
      post && {
        ...post,
        tags: post.tags.map((tag) => {
          return {
            ...tag,
            createdAt: dayjs(tag.createdAt).format(),
          }
        }),
        createdAt: dayjs(post.createdAt).format(),
        updatedAt: dayjs(post.updatedAt).format(),
      }
    )
  },
}
