import { BlogSidebar } from '@/components/dashboard/BlogSidebar'
import { AppLayout } from '@/components/layouts/AppLayout'
import {
  useDeletePostMutation,
  useGetBlogForDashboardQuery,
  useGetPostsForDashboardQuery,
} from '@/generated/graphql'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

// export const getServerSideProps: GetServerSideProps = (ctx) => {
//     return {props:{}}
// }

export default function BlogDashboard() {
  const router = useRouter()
  const blogSlug = router.query.blog as string
  const page = parseInt((router.query.page as string | undefined) || '1', 10)
  const [postsResult, refetchPostsResult] = useGetPostsForDashboardQuery({
    variables: {
      blogSlug,
      page,
    },
    requestPolicy: 'cache-and-network',
  })

  const posts = postsResult.data?.posts
  const isEmpty = posts?.data.length === 0 && page === 1

  const [blogResult] = useGetBlogForDashboardQuery({
    variables: {
      slug: blogSlug,
    },
    requestPolicy: 'cache-and-network',
  })

  const blogName = blogResult?.data?.blog.name

  const [, deletePostMutation] = useDeletePostMutation()

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete it?')) return

    await deletePostMutation({ id })
    refetchPostsResult()
  }

  return (
    <AppLayout
      title={blogName}
      mainTitle={false}
      renderSidebar={() => <BlogSidebar />}
    >
      <div className="flex items-center justify-between mb-5 border-b pb-3">
        {posts && !isEmpty && (
          <div className="text-gray-200 text-xl">
            {posts.total} Post{posts.total > 1 ? 's' : ''}
          </div>
        )}
        <div>
          <Link href={`/dashboard/${blogSlug}/new-post`}>
            <a className="bg-blue-500 rounded-md px-3 h-7 text-xs inline-flex items-center text-white">
              New Post
            </a>
          </Link>
        </div>
      </div>
      {isEmpty && <div>You have have any posts yet.</div>}
      {posts && (
        <div className="space-y-4">
          {posts.data.map((post) => {
            return (
              <div key={post.id}>
                <div className="flex justify-between items-center">
                  <h2>
                    <Link href={`/dashboard/${blogSlug}/edit-post/${post.id}`}>
                      <a className="text-gray-200 hover:underline">
                        {post.title}
                      </a>
                    </Link>
                  </h2>
                  <span className="text-sm">{post.date}</span>
                </div>
                <div className="text-xs mt-2 space-x-3">
                  <Link href={`/${blogSlug}/${post.slug}`}>
                    <a className="hover:underline">Preview</a>
                  </Link>
                  <button
                    className="text-red-700 hover:underline"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppLayout>
  )
}
