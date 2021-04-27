import { BlogInfo, BlogLayout } from '@/components/layouts/BlogLayout'
import { blogService } from '@server/services/blog.service'
import { GetServerSideProps } from 'next'

type PageProps = {
  blog: BlogInfo
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const blog = await blogService.getBlogBySlug(ctx.query.blog as string)
  if (!blog) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      blog,
    },
  }
}

const Archives: React.FC<PageProps> = ({ blog }) => {
  return (
    <BlogLayout blog={blog} title={`Subscribe ${blog.name}`}>
      <div className="rich-content">
        <h2 className="text-white">Subscribe via RSS</h2>
        <p>
          This blog delivers updates via{' '}
          <a
            href="https://en.wikipedia.org/wiki/RSS"
            target="_blank"
            rel="nofollow noopener"
          >
            RSS
          </a>
          . To use it, you need a reader.
        </p>

        <ol>
          <li>
            Register at one of the services or install an app. Good list of
            hosted RSS readers and apps can be found{' '}
            <a
              target="_blank"
              rel="nofollow noopener"
              href="https://zapier.com/blog/best-rss-feed-reader-apps/"
            >
              here
            </a>
            .
          </li>
          <li>
            Add this url to the sources:{' '}
            <code>
              {encodeURI(`https://blogify.dev/${blog.name}/atom.xml`)}
            </code>
          </li>
          <li>Enjoy!</li>
        </ol>
      </div>
    </BlogLayout>
  )
}

export default Archives
