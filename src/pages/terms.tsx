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

const Terms: React.FC<PageProps> = ({ user }) => {
  return (
    <AppLayout title="Terms of Service">
      <h2 className="page-title">Terms of Service</h2>
      <div className="rich-content text-gray-200">
        <h2>Terms</h2>
        <p>
          By accessing this web site, you are agreeing to be bound by these web
          site Terms and Conditions of Use, our Privacy Policy, all applicable
          laws and regulations, and agree that you are responsible for
          compliance with any applicable local laws. If you do not agree with
          any of these terms, you are prohibited from using or accessing this
          site. The materials contained in this web site are protected by
          applicable copyright and trade mark law.
        </p>
        <h2>Limitations</h2>
        <p>
          In no event shall Blogify or its suppliers be liable for any damages
          (including, without limitation, damages for loss of data or profit, or
          due to business interruption,) arising out of the use or inability to
          use the materials on Blogify's Internet site, even if Blogify or an
          authorized representative has been notified orally or in writing of
          the possibility of such damage. Because some jurisdictions do not
          allow limitations on implied warranties, or limitations of liability
          for consequential or incidental damages, these limitations may not
          apply to you.
        </p>
        <h2>Links</h2>
        <p>
          Blogify has not reviewed all of the sites linked to its Internet web
          site and is not responsible for the contents of any such linked site.
          The inclusion of any link does not imply endorsement by Blogify of the
          site. Use of any such linked web site is at the user's own risk.
        </p>
        <h2>Copyright / Takedown</h2>
        <p>
          Users agree and certify that they have rights to share all content
          that they post on Blogify — including, but not limited to, information
          posted in articles, discussions, and comments. This rule applies to
          prose, code snippets, collections of links, etc. Regardless of
          citation, users may not post copy and pasted content that does not
          belong to them. Users assume all risk for the content they post,
          including someone else's reliance on its accuracy, claims relating to
          intellectual property, or other legal rights. If you believe that a
          user has plagiarized content, misrepresented their identity,
          misappropriated work, or otherwise run afoul of DMCA regulations,
          please email. Blogify may remove any content users post for any
          reason.
        </p>
        <h2>Site Terms of Use Modifications</h2>
        <p>
          Blogify may revise these terms of use for its web site at any time
          without notice. By using this web site you are agreeing to be bound by
          the then current version of these Terms and Conditions of Use.
        </p>
        <h2>Reserved Names</h2>
        <p>
          Blogify has the right to maintain a list of reserved names which will
          not be made publicly available. These reserved names may be set aside
          for purposes of proactive trademark protection, avoiding user
          confusion, security measures, or any other reason (or no reason).
        </p>
        <p>
          Additionally, Blogify reserves the right to change any already-claimed
          name at its sole discretion. In such cases, Blogify will make
          reasonable effort to find a suitable alternative and assist with any
          transition-related concerns.
        </p>
        <h2>Content Policy</h2>
        <p>
          The following policy applies to articles, and all other works shared
          on the Blogify platform:
        </p>
        <ul>
          <li>
            Users must make a good-faith effort to share content that is
            on-topic, of high-quality, and is not designed primarily for the
            purposes of promotion or creating backlinks.
          </li>
          <li>
            Posts must contain substantial content — they may not merely
            reference an external link that contains the full post.
          </li>
          <li>
            If a post contains affiliate links, that fact must be clearly
            disclosed. For instance, with language such as: “This post includes
            affiliate links; I may receive compensation if you purchase products
            or services from the different links provided in this article.”
          </li>
        </ul>
        <p>
          Blogify reserves the right to remove any content that it deems to be
          in violation of this policy at its sole discretion. Additionally,
          Blogify reserves the right to restrict any user’s ability to
          participate on the platform at its sole discretion.
        </p>

        <h2>Governing Law</h2>
        <p>
          Any claim relating to Blogify's web site shall be governed by the laws
          of the State of New York without regard to its conflict of law
          provisions.
        </p>
        <p>General Terms and Conditions applicable to Use of a Web Site.</p>
      </div>
    </AppLayout>
  )
}

export default Terms
