import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export type BlogInfo = {
  id: number
  slug: string
  name: string
  user: {
    id: number
    avatar?: string | null
  }
}

export const BlogLayout: React.FC<{
  blog: BlogInfo
  title?: string
}> = ({ blog, children, title }) => {
  const avatar = blog.user.avatar

  return (
    <div>
      <Head>
        <title>{title}</title>
        <link
          href={encodeURI(`/${blog.slug}/atom.xml`)}
          rel="alternate"
          title={blog.name}
          type="application/atom+xml"
        />
        {avatar && <link rel="icon" type="image/png" href={avatar} />}
      </Head>
      <div className="pt-10 pb-10 max-w-3xl mx-auto px-5 md:px-8 flex justify-between items-center">
        <div className="flex space-x-3 items-center">
          {avatar && (
            <Link href={`/${blog.slug}`}>
              <span
                className="cursor-pointer w-12 h-12 inline-block bg-gray-200 bg-center bg-cover rounded-lg"
                style={{
                  backgroundImage: `url("${avatar}")`,
                }}
              ></span>
            </Link>
          )}
          <div>
            <h2 className="text-xl">
              <Link href={`/${blog.slug}`}>
                <a>{blog.name}</a>
              </Link>
            </h2>
          </div>
        </div>
        <div>
          <Link href={`/${blog.slug}/subscribe`}>
            <a className="border text-white h-10 inline-flex items-center px-3 rounded-lg hover:bg-bg-darker">
              Subscribe
            </a>
          </Link>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-5 md:px-8">{children}</div>
      <footer className="mb-20 mt-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <Link href="/">
            <a className="text-sm hover:underline">Published on Blogify.</a>
          </Link>
        </div>
      </footer>
    </div>
  )
}
