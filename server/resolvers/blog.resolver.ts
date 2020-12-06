import { GqlContext } from '@server/decorators/gql-context'
import type { TGqlContext } from '@server/decorators/gql-context'
import { requireAuth } from '@server/guards/require-auth'
import { prisma } from '@server/prisma'
import {
  Args,
  ArgsType,
  Field,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql'
import { MaxLength, MinLength } from 'class-validator'
import { requireBlogAccess } from '@server/guards/require-blog-access'
import { ApolloError } from 'apollo-server-micro'

@ArgsType()
class CreateBlogArgs {
  @Field()
  @MinLength(2)
  @MaxLength(20)
  name: string

  @Field()
  @MinLength(2)
  @MaxLength(20)
  slug: string
}

@ArgsType()
class UpdateBlogArgs {
  @Field((type) => Int)
  id: number

  @Field()
  @MinLength(2)
  @MaxLength(20)
  slug: string

  @Field()
  @MinLength(2)
  @MaxLength(20)
  name: string

  @Field()
  introduction: string
}

@ObjectType()
class Blog {
  @Field((type) => ID)
  id: number

  @Field()
  name: string

  @Field()
  introduction: string

  @Field()
  slug: string
}

const checkIfBlogSlugIsUsed = async (slug: string) => {
  const existing = await prisma.blog.findUnique({
    where: {
      slug,
    },
  })
  if (existing) {
    throw new ApolloError(`${slug} is already used`, `blog_slug_used`, {
      field: 'slug',
    })
  }
}

@Resolver()
export class BlogResolver {
  @Query((returns) => String)
  hello() {
    return 'hello'
  }

  @Mutation((returns) => Blog)
  async createBlog(
    @GqlContext() ctx: TGqlContext,
    @Args() args: CreateBlogArgs,
  ) {
    const user = await requireAuth(ctx.req)
    await checkIfBlogSlugIsUsed(args.slug)
    const blog = await prisma.blog.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        name: args.name,
        slug: args.slug,
        introduction: `I just started blogging on Blogify, it's awesome!`,
      },
    })
    return blog
  }

  @Mutation((returns) => Blog)
  async updateBlog(
    @GqlContext() ctx: TGqlContext,
    @Args() args: UpdateBlogArgs,
  ) {
    const user = await requireAuth(ctx.req)
    const blog = await prisma.blog.findUnique({
      where: {
        id: args.id,
      },
    })
    if (!blog) {
      throw new ApolloError(`Blog not found`)
    }
    requireBlogAccess(user, blog)
    if (blog.slug !== args.slug) {
      await checkIfBlogSlugIsUsed(args.slug)
    }
    const updatedBlog = await prisma.blog.update({
      where: {
        id: args.id,
      },
      data: {
        slug: args.slug,
        name: args.name,
        introduction: args.introduction,
      },
    })
    return updatedBlog
  }
}
