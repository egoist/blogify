import Link from 'next/link'
import React from 'react'
import Head from 'next/head'
import clsx from 'clsx'
import { useRouter } from 'next/router'

export const AppLayout: React.FC<{
  title?: string
  renderSidebar?: () => React.ReactElement
  mainTitle?: string | false
}> = ({ children, title, renderSidebar, mainTitle }) => {
  const router = useRouter()
  const nav = [
    {
      text: 'Logout',
      href: '/api/auth/logout',
    },
  ]
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="px-5 border-b fixed h-14 top-0 left-0 right-0">
        <div className="h-full flex items-center justify-between">
          <h1 className="text-accent">
            <Link href={'/'}>
              <a>Blogify</a>
            </Link>
          </h1>
          <div className="space-x-5">
            {nav.map((link) => {
              return (
                <Link key={link.text} href={link.href}>
                  <a
                    className={clsx(
                      'hover:text-white',
                      link.href === router.asPath && 'text-white',
                    )}
                  >
                    <span className="">{link.text}</span>
                  </a>
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      {renderSidebar && renderSidebar()}

      <div className={clsx(`main pt-14`, renderSidebar && `md:ml-72`)}>
        {title && mainTitle !== false && (
          <div className="container">
            <h2 className="mb-8 text-3xl text-gray-200">
              {mainTitle || title}
            </h2>
          </div>
        )}
        <div className="container">{children}</div>
      </div>
    </>
  )
}
