import { useLikePostMutation } from '@/generated/graphql'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'

export const LikeButton: React.FC<{
  count: number
  postId: number
  hasLogin: boolean
  isLiked?: boolean
}> = ({ count, postId, hasLogin, isLiked }) => {
  const [, likePostMutation] = useLikePostMutation()
  const [actualCount, setActualCount] = React.useState(count)
  const [actualIsLiked, setActualIsLiked] = React.useState<boolean | undefined>(
    isLiked,
  )
  const router = useRouter()

  const likePost = async () => {
    if (!hasLogin) {
      return router.push({
        pathname: '/login',
        query: {
          return: router.asPath,
        },
      })
    }
    const { data } = await likePostMutation({
      postId,
    })
    if (data) {
      setActualCount(data.likePost.likesCount)
      setActualIsLiked(data.likePost.isLiked)
    }
  }

  return (
    <button
      className={clsx(
        `border border-button-border px-3 h-8 inline-flex items-center focus:outline-none`,
        actualIsLiked && `text-red-500`,
      )}
      onClick={likePost}
    >
      <svg
        width="1em"
        height="1em"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
      <span className="ml-2">{actualCount}</span>
    </button>
  )
}
