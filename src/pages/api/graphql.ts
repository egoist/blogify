import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-micro'
import { NextApiHandler } from 'next'
import { buildSchema } from 'type-graphql'
import { BlogResolver } from '@server/resolvers/blog.resolver'
import { PostResolver } from '@server/resolvers/post.resolver'

export const config = {
  api: {
    bodyParser: false,
  },
}

let handler: any

const isProd = process.env.NODE_ENV === 'production'

const apiHandler: NextApiHandler = async (req, res) => {
  if (handler && isProd) {
    return handler(req, res)
  }

  const schema = await buildSchema({
    resolvers: [BlogResolver, PostResolver],
  })

  const apolloServer = new ApolloServer({
    schema,
    playground: !isProd,
    tracing: !isProd,
    context({ req, res }) {
      return {
        req,
        res,
        user: req.user,
      }
    },
  })

  handler = apolloServer.createHandler({
    path: `/api/graphql`,
  })

  return handler(req, res)
}

export default apiHandler
