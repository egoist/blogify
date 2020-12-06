import Link from 'next/link'
import React from 'react'
import { BaseLayout } from './BaseLayout'

export type BlogInfo = {
  slug: string
  name: string
}

export const BlogLayout: React.FC<{
  blog: BlogInfo
  title?: string
}> = ({ blog, children, title }) => {
  const nav = [
    {
      text: 'Archives',
      href: `/${blog.slug}/archives`,
    },
  ]

  return (
    <BaseLayout
      title={title ? `${title} - ${blog.name}` : blog.name}
      nav={nav}
      headerTitle={blog.name}
      headerTitleHref={`/${blog.slug}`}
      children={children}
      footer={
        <div className="text-center">
          <Link href="/">
            <a className="text-sm hover:underline">Publish on Blogify</a>
          </Link>
        </div>
      }
    />
  )
}
