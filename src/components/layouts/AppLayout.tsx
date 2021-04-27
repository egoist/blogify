import Link from 'next/link'
import React from 'react'
import { BaseLayout } from './BaseLayout'

export const AppLayout: React.FC<{ user?: any; title?: string }> = ({
  user,
  children,
  title,
}) => {
  const nav = user
    ? [
        {
          text: 'About',
          href: '/about',
        },
        {
          text: 'Blogs',
          href: '/blogs',
        },
        {
          text: 'Logout',
          href: '/api/auth/logout',
        },
      ]
    : [
        {
          text: 'About',
          href: '/about',
        },
        {
          text: 'Login',
          href: '/login',
        },
      ]
  return (
    <BaseLayout
      title={title ? `${title} - Blogify` : `Blogify`}
      headerTitle="Blogify"
      nav={nav}
      children={children}
      footer={
        <div className="text-center">
          <Link href="/">
            <a>Blogify</a>
          </Link>
          <div className="space-x-3 text-xs mt-2">
            <Link href="/terms">
              <a className="link">Terms</a>
            </Link>
            <Link href="/privacy">
              <a className="link">Privacy</a>
            </Link>
            <a
              className="link"
              href="https://github.com/egoist/blogify"
              target="blank"
              rel="noreferer nofollow"
            >
              GitHub
            </a>
          </div>
        </div>
      }
    />
  )
}
