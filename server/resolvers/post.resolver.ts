import { GqlContext } from '@server/decorators/gql-context'
import type { TGqlContext } from '@server/decorators/gql-context'
import {
  Args,
  ArgsType,
  Field,
  ID,
  Int,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql'
import { requireAuth } from '@server/guards/require-auth'
import { prisma } from '@server/prisma'
import { requireBlogAccess } from '@server/guards/require-blog-access'
import { customAlphabet } from 'nanoid'
import { ApolloError } from 'apollo-server-micro'
import { getExcerpt } from '@server/markdown'
import { slugify } from '@server/lib/slugify'

const randomSlugSuffix = customAlphabet(
  `abcdefghijklmnopqrstuvwxyz0123456789`,
  4,
)

@ArgsType()
class CreatePostArgs {
  @Field()
  title: string

  @Field()
  content: string

  @Field()
  blogSlug: string

  @Field()
  slug: string

  @Field()
  tags: string

  @Field()
  cover: string
}

@ObjectType()
class Post {
  @Field((type) => ID)
  id: number

  @Field()
  slug: String

  @Field()
  content: String

  @Field()
  title: String

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date
}

@ArgsType()
class UpdatePostArgs {
  @Field((type) => Int)
  id: number

  @Field()
  title: string

  @Field()
  content: string

  @Field()
  tags: string

  @Field()
  slug: string

  @Field()
  cover: string
}

@ArgsType()
class LikePostArgs {
  @Field((type) => Int)
  postId: number
}

@ObjectType()
class LikePostResult {
  @Field((type) => Int)
  likesCount: number

  @Field()
  isLiked: boolean
}

const formatTags = (tags: string) => {
  tags = tags.trim()
  if (!tags) return []
  return tags.split(',').map((tag) => tag.trim())
}

const parseContent = async ({
  title,
  content,
  slug,
  checkSlugUniqueness,
}: {
  title: string
  content: string
  slug: string
  checkSlugUniqueness?: {
    blogId: number
  }
}) => {
  if (!slug) {
    slug = slugify(title)
  }
  if (checkSlugUniqueness) {
    const existingBySlug = await prisma.post.findFirst({
      where: {
        slug,
        blogId: checkSlugUniqueness.blogId,
      },
    })
    if (existingBySlug) {
      slug += `-${randomSlugSuffix()}`
    }
  }
  const excerpt = getExcerpt(content)
  return {
    title,
    slug,
    content,
    excerpt,
  }
}

const populateTags = async (blogId: number, tags: string) => {
  const result: {
    create: Array<{
      blog: { connect: { id: number } }
      slug: string
      name: string
    }>
    connect: Array<{ id: number }>
  } = {
    create: [],
    connect: [],
  }
  await Promise.all(
    formatTags(tags)
      .slice(0, 10) // Only allows 10 tags
      .map(async (name) => {
        const slug = slugify(name)
        const existing = await prisma.tag.findFirst({
          where: {
            blogId,
            slug,
          },
        })
        if (existing) {
          result.connect.push({
            id: existing.id,
          })
        } else {
          result.create.push({
            blog: {
              connect: {
                id: blogId,
              },
            },
            slug,
            name,
          })
        }
      }),
  )
  return result
}

@Resolver()
export class PostResolver {
  @Mutation((returns) => Post)
  async createPost(
    @GqlContext() ctx: TGqlContext,
    @Args() args: CreatePostArgs,
  ) {
    const user = await requireAuth(ctx.req)
    const blog = await prisma.blog.findUnique({
      where: {
        slug: args.blogSlug,
      },
    })
    if (!blog) {
      throw new ApolloError(`Blog not found`)
    }
    requireBlogAccess(user, blog)

    const parsed = await parseContent({
      title: args.title,
      content: args.content,
      slug: args.slug,
      checkSlugUniqueness: {
        blogId: blog.id,
      },
    })

    const post = await prisma.post.create({
      data: {
        blog: {
          connect: {
            id: blog.id,
          },
        },
        title: parsed.title,
        content: parsed.content,
        excerpt: parsed.excerpt,
        slug: parsed.slug,
        cover: args.cover,
        tags: await populateTags(blog.id, args.tags),
      },
    })

    return post
  }

  @Mutation((returns) => Post)
  async updatePost(
    @GqlContext() ctx: TGqlContext,
    @Args() args: UpdatePostArgs,
  ) {
    const user = await requireAuth(ctx.req)
    const post = await prisma.post.findUnique({
      where: {
        id: args.id,
      },
      include: {
        blog: true,
      },
    })

    if (!post) {
      throw new ApolloError(`Post not found`)
    }

    requireBlogAccess(user, post.blog)

    const parsed = await parseContent({
      title: args.title,
      content: args.content,
      slug: args.slug,
      // Skip checking if slug doesn't change at all
      checkSlugUniqueness:
        args.slug === post.slug
          ? undefined
          : {
              blogId: post.blog.id,
            },
    })

    const updatedPost = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: parsed.title,
        content: parsed.content,
        excerpt: parsed.excerpt,
        slug: parsed.slug,
        cover: args.cover,
        tags: await populateTags(post.blogId, args.tags),
      },
    })
    return updatedPost
  }

  @Mutation((returns) => LikePostResult)
  async likePost(@GqlContext() ctx: TGqlContext, @Args() args: LikePostArgs) {
    const user = await requireAuth(ctx.req)
    const post = await prisma.post.findUnique({
      where: {
        id: args.postId,
      },
    })
    if (!post) {
      throw new ApolloError(`Post not found`)
    }
    const like = await prisma.like.findFirst({
      where: {
        userId: user.id,
        postId: post.id,
      },
    })
    if (like) {
      await prisma.like.delete({
        where: {
          id: like.id,
        },
      })
      await prisma.post.update({
        where: {
          id: post.id,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      })
      return {
        isLiked: false,
        likesCount: post.likesCount - 1,
      }
    }
    await prisma.like.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        post: {
          connect: {
            id: post.id,
          },
        },
      },
    })
    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    })
    return {
      likesCount: post.likesCount + 1,
      isLiked: true,
    }
  }
}
