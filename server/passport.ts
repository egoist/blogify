import passport, { Profile } from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github'
import { AUTH_COOKIE_NAME } from './constants'
import { IncomingMessage, ServerResponse } from 'http'
import { serialize } from 'cookie'
import { redirect } from './response'
import { prisma } from './prisma'
import { nanoid } from 'nanoid'

passport.serializeUser<any, number>((user, done) => {
  done(null, user.id)
})

passport.deserializeUser<any, number>((id, done) => {
  prisma.user
    .findUnique({
      where: {
        id,
      },
    })
    .then((user) => {
      done(null, user)
    })
    .catch((error) => {
      console.log(`Error: ${error}`)
    })
})

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
//     },
//     async (accessToken, refreshToken, profile, cb) => {
//       const user = await getUserByProviderProfile(profile, 'google')
//       cb(null, user)
//     },
//   ),
// )

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `/api/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const user = await getUserByProviderProfile(profile, 'github')
        cb(null, user)
      } catch (error) {
        cb(error)
      }
    },
  ),
)

async function getUserByProviderProfile(
  profile: Profile,
  provider: 'github' | 'google',
) {
  let email = profile.emails && profile.emails[0].value
  const avatar = profile.photos && profile.photos[0].value

  if (!email) {
    // Some users might not have a public email
    email = `${provider}_${profile.id}@mail-holder.blogify.dev`
  }

  const providerKey = `${provider}UserId`

  // Find one by provider user id
  let existing = await prisma.user.findUnique({
    where: {
      [providerKey]: profile.id,
    },
  })
  // Otherwise find one with the same email and link them
  if (!existing) {
    existing = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    if (existing) {
      await prisma.user.update({
        where: {
          id: existing.id,
        },
        data: {
          [providerKey]: profile.id,
        },
      })
    }
  }

  if (!existing) {
    existing = await prisma.user.create({
      data: {
        email,
        name: profile.displayName || profile.username || 'My Name',
        [providerKey]: profile.id,
        avatar,
      },
    })
  }

  if (avatar && existing.avatar !== avatar) {
    await prisma.user.update({
      where: {
        id: existing.id,
      },
      data: {
        avatar,
      },
    })
  }

  return existing
}

export { passport }

export async function handleSuccessfulLogin(
  req: IncomingMessage,
  res: ServerResponse,
) {
  const { id } = (req as $TsFixMe).user
  const session = await prisma.session.create({
    data: {
      token: nanoid(),
      user: {
        connect: {
          id,
        },
      },
    },
  })
  const maxAge = 60 * 60 * 24 * 90 // 3 month
  const authCookie = serialize(AUTH_COOKIE_NAME, session.token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge,
  })
  res.setHeader('Set-Cookie', [authCookie])
  redirect(res, '/')
}
