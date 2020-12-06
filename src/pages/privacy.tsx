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

const Privacy: React.FC<PageProps> = ({ user }) => {
  return (
    <AppLayout title="Privacy Policy" user={user}>
      <h2 className="page-title">Privacy Policy</h2>
      <div className="rich-content text-gray-200">
        <h2>What information Blogify collects and Why</h2>
        <p>
          Blogify doesn't collect or store any personal information besides your
          GitHub public profile.
        </p>
        <h2>The Use of Cookies</h2>
        <p>
          Cookies are necessary for the Site to function and cannot be switched
          off in our systems. For example, we use cookies to authenticate you.
          When you log on to our websites, authentication cookies are set which
          let us know who you are during a browsing session. We have to load
          essential cookies for legitimate interests pursued by us in delivering
          our Site's essential functionality to you.
        </p>
        <h2>Third Party Vendors</h2>
        <h3>Server</h3>
        <p>
          Our website is hosted by Hetzner, a well-known Internet hosting
          company located at Germany, Europe.
        </p>
        <h4>Storage</h4>
        <p>
          Images and other kinds of static files uploaded by users are stored on
          Amazon S3.
        </p>
      </div>
    </AppLayout>
  )
}

export default Privacy
