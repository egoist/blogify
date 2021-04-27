import { parse } from 'cookie'
import { IncomingMessage } from 'http'
import { NextApiRequest } from 'next'
import { AUTH_COOKIE_NAME } from './constants'
import { prisma } from './prisma'

export type UserSession = {
  id: number
  name: string
  avatar?: string | null
}

export const getServerSession = async (
  req: NextApiRequest | IncomingMessage,
): Promise<{ user: UserSession | null }> => {
  const token = parse(req.headers.cookie || '')[AUTH_COOKIE_NAME]

  if (!token) return { user: null }

  const session = await prisma.session.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  })

  if (!session) {
    return { user: null }
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      avatar: session.user.avatar,
    },
  }
}
