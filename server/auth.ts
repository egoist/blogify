import Iron from '@hapi/iron'
import { parse } from 'cookie'
import { IncomingMessage } from 'http'
import { NextApiRequest } from 'next'
import { AUTH_COOKIE_NAME } from './constants'
import { prisma } from './prisma'

export type AuthUser = {
  userId: number
}

export function createSecureToken(payload: AuthUser) {
  const token = Iron.seal(payload, process.env.HASH_KEY, Iron.defaults)
  return token
}

export async function parseSecureToken(
  token?: string,
): Promise<AuthUser | null> {
  if (!token) return null
  try {
    return Iron.unseal(token, process.env.HASH_KEY, Iron.defaults)
  } catch (error) {
    console.error('auth error', error)
    return null
  }
}

export const getServerSession = async (
  req: NextApiRequest | IncomingMessage,
): Promise<{ user: UserSession | null }> => {
  const token = parse(req.headers.cookie || '')[AUTH_COOKIE_NAME]

  const authUser = await parseSecureToken(token)

  if (!authUser) {
    return { user: null }
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
  })

  return {
    user: user && {
      name: user.name,
      email: user.email,
      id: user.id,
    },
  }
}

export type UserSession = {
  name: string
  email: string
  id: number
}
