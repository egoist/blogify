import React from 'react'
import { useRouter } from 'next/router'
import {
  useGetMyBlogsQuery,
  useSetLastActiveBlogMutation,
} from '@/generated/graphql'
import Link from 'next/link'
import clsx from 'clsx'

const BlogSelect = () => {
  const router = useRouter()
  const [myBlogsResult] = useGetMyBlogsQuery({
    requestPolicy: 'cache-and-network',
  })
  const [open, setOpen] = React.useState(false)
  const elRef = React.useRef<HTMLDivElement | null>(null)

  const currentBlog = myBlogsResult.data?.blogs.find(
    (blog) => blog.slug === router.query.blog,
  )
  const [, setLastActiveBlog] = useSetLastActiveBlogMutation()

  React.useEffect(() => {
    const handleClick = (e: any) => {
      if (elRef.current && !elRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  React.useEffect(() => {
    if (currentBlog?.id) {
      setLastActiveBlog({ id: currentBlog.id })
    }
  }, [currentBlog?.id])

  return (
    <div className="relative" ref={elRef}>
      <button
        className="w-full border flex justify-between shadow rounded-md h-9 items-center px-3 focus:outline-none focus:ring"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <span>{currentBlog?.name || 'Loading'}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-gray-400"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 right-0 mt-3 bg-bg">
          {myBlogsResult.data && (
            <ul
              v-if="sites"
              className="rounded-md w-full border shadow overflow-hidden text-sm"
            >
              {myBlogsResult.data.blogs.map((blog) => (
                <li key={blog.id}>
                  <Link
                    href={`/dashboard/${blog.slug}`}
                    v-slot="{ isActive, href, navigate }"
                  >
                    <a className="px-5 h-10 flex items-center justify-between hover:bg-bg-darker">
                      <span>{blog.name}</span>
                      {router.asPath === `/dashboard/${blog.slug}` && (
                        <svg
                          className="w-5 h-5 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </a>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/new-blog">
                  <a className="px-5 pl-4 h-10 flex items-center space-x-2 hover:bg-bg-darker">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span>Create Blog</span>
                  </a>
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}{' '}
    </div>
  )
}

export const BlogSidebar = () => {
  const router = useRouter()
  const blogSlug = router.query.blog as string
  const nav = [
    {
      text: 'Posts',
      link: `/dashboard/${blogSlug}`,
    },
    {
      text: 'Settings',
      link: `/dashboard/${blogSlug}/settings`,
    },
  ]
  return (
    <aside className="w-72 border-r fixed top-14 bottom-0 left-0">
      <div className="p-5">
        <BlogSelect />
      </div>
      <div>
        <div className="px-5 text-xs mb-5 flex">
          <a
            href={`/${blogSlug}`}
            className="inline-flex items-center space-x-1 hover:underline"
            target="_blank"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            <span>Preview</span>
          </a>
        </div>
        <ul>
          {nav.map((item) => {
            const isActive = item.link === router.asPath
            return (
              <li key={item.text}>
                <Link href={item.link}>
                  <a
                    className={clsx(
                      `px-5 h-10 flex items-center`,
                      isActive && `bg-bg-darker text-white`,
                      !isActive && `hover:text-gray-300`,
                    )}
                  >
                    {item.text}
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
