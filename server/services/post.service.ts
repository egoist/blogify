import { prisma } from '@server/prisma'

export const postService = {
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
