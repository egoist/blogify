import { AppLayout } from '@/components/layouts/AppLayout'
import { getServerSession, UserSession } from '@server/auth'
import { GetServerSideProps } from 'next'

type PageProps = {
  user: UserSession | null
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)

  return {
    props: {
      user,
    },
  }
}

const About: React.FC<PageProps> = ({ user }) => {
  return (
    <AppLayout title="About" user={user}>
      <h2 className="page-title">About</h2>
      <div className="rich-content text-gray-200">
        <p>Blogify is a blogging platform for minimalists and developers.</p>
        <h2>Yet Another Blogging Platform?</h2>
        <p>
          There're a lot places where you can host a blog, for free, but Blogify
          is designed to be simple instead of bloated by features.
        </p>
        <h2>Your privacy is guaranteed</h2>
        <p>Nobody resells your private data or track your usage.</p>
        <h2>No advertising</h2>
        <p>Enjoy the ad-free experience!</p>
        <h2>Free, open source and self-hosted</h2>
        <p>
          Blogify is free to use, the source code is also available on GitHub.
        </p>
      </div>
    </AppLayout>
  )
}

export default About
