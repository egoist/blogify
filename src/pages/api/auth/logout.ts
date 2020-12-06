import { NextApiHandler } from 'next'
import { serialize } from 'cookie'
import { AUTH_COOKIE_NAME } from '@server/constants'

const handler: NextApiHandler = (req, res) => {
  res.setHeader('Set-Cookie', [
    serialize(AUTH_COOKIE_NAME, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    }),
  ])
  res.redirect('/')
}

export default handler
