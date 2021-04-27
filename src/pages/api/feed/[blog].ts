import { prisma } from '@server/prisma'
import { blogService } from '@server/services/blog.service'
import { NextApiHandler } from 'next'
import { Feed } from 'feed'
import { renderMarkdown } from '@server/markdown'

const handler: NextApiHandler = async (req, res) => {
  const blogSlug = req.query.blog as string
  const blog = await prisma.blog.findUnique({
    where: {
      slug: blogSlug,
    },
    include: {
      user: true,
    },
  })
  if (!blog) {
    res.status(404)
    res.end('404')
    return
  }
  const posts = await prisma.post.findMany({
    where: {
      blog: {
        id: blog.id,
      },
    },
    take: 30,
    orderBy: {
      createdAt: 'desc',
    },
  })
  const url = `https://blogify.dev/${blog.slug}`
  const feed = new Feed({
    id: url,
    title: blog.name,
    author: {
      name: blog.user.name,
      email: '',
      link: url,
    },
    copyright: `all rights reserved`,
  })
  for (const post of posts) {
    const { html } = renderMarkdown(post.content)
    feed.addItem({
      title: post.title,
      description: post.excerpt,
      content: html,
      link: `${url}/${post.slug}`,
      date: post.createdAt,
    })
  }
  res.setHeader('Content-Type', `application/xml`)
  res.end(feed.atom1())
}

export default handler
