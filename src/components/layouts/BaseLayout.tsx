import clsx from 'clsx'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type NavItem = {
  text: string
  href: string
}

export const BaseLayout: React.FC<{
  nav: NavItem[]
  title: string
  headerTitle: string
  headerTitleHref?: string
  footer: React.ReactElement
}> = ({ nav, title, children, headerTitle, headerTitleHref, footer }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <header className="border-b border-border">
        <div className="container h-14 flex items-center justify-between">
          <h1 className="text-lg text-accent">
            <Link href={headerTitleHref || '/'}>
              <a>{headerTitle}</a>
            </Link>
          </h1>
          <div className="space-x-5">
            {nav.map((link) => {
              return (
                <Link key={link.text} href={link.href}>
                  <a
                    className={clsx(
                      `link`,
                      link.href === router.asPath && 'is-active',
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

      <div className="main">
        <div className="container">{children}</div>
      </div>

      <footer className="py-5 mt-20">
        <div className="container">{footer}</div>
      </footer>
    </>
  )
}
