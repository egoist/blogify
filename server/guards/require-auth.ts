import { AuthenticationError } from 'apollo-server-micro'
import { IncomingMessage } from 'http'
import { NextApiRequest } from 'next'
import { getServerSession } from '@server/auth'

export async function requireAuth(req: NextApiRequest | IncomingMessage) {
  const { user } = await getServerSession(req)

  if (!user) {
    throw new AuthenticationError(`User not found`)
  }

  return user
}

export async function optionalAuth(req: NextApiRequest | IncomingMessage) {
  const { user } = await getServerSession(req)

  return user
}
