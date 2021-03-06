import { ApolloError } from 'apollo-server-micro'
import { Blog } from '@prisma/client'

export async function requireBlogAccess(user: { id: number }, blog: Blog) {
  if (user.id !== blog.userId) {
    throw new ApolloError(`Admin permission required!`)
  }
}
