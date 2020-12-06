import { Button } from '@/components/Button'
import { AppLayout } from '@/components/layouts/AppLayout'
import { useUpdateBlogMutation } from '@/generated/graphql'
import { getServerSession, UserSession } from '@server/auth'
import { blogService } from '@server/services/blog.service'
import { useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import * as Yup from 'yup'
import React from 'react'
import { createSnackbar } from '@snackbar/core'
import { useRouter } from 'next/router'
import { BlogInfo } from '@/components/layouts/BlogLayout'

type PageProps = {
  user: UserSession
  blog: BlogInfo & {
    introduction: string
    id: number
  }
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  ctx,
) => {
  const { user } = await getServerSession(ctx.req)
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  const blog = await blogService.getBlogBySlug(ctx.query.blog as string)
  if (!blog) {
    return { notFound: true }
  }
  return {
    props: {
      user,
      blog: {
        id: blog.id,
        name: blog.name,
        slug: blog.slug,
        introduction: blog.introduction,
      },
    },
  }
}

const BlogSettings: React.FC<PageProps> = ({ user, blog }) => {
  const title = `Settings for "${blog.name}"`

  const router = useRouter()
  const [, updateBlogMutation] = useUpdateBlogMutation()

  const form = useFormik({
    initialValues: {
      name: blog.name,
      slug: blog.slug,
      introduction: blog.introduction,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(2).max(20).required(),
      slug: Yup.string().min(2).max(20).required(),
      introduction: Yup.string().max(1000),
    }),
    async onSubmit(values) {
      const { data, error } = await updateBlogMutation({
        id: blog.id,
        slug: values.slug,
        name: values.name,
        introduction: values.introduction,
      })
      if (data) {
        createSnackbar(`Changes have been saved`, {
          timeout: 3000,
        })
        router.replace(`/${values.slug}/settings`)
      } else if (error) {
        const field =
          error.graphQLErrors &&
          error.graphQLErrors[0] &&
          error.graphQLErrors[0].extensions &&
          error.graphQLErrors[0].extensions['field']
        const message = error.message.replace('[GraphQL] ', '')
        if (field) {
          form.setFieldError(field, message)
        } else {
          createSnackbar(message, {
            timeout: 3000,
            theme: {
              actionColor: 'red',
            },
          })
        }
      }
    },
  })

  return (
    <AppLayout user={user} title={title}>
      <h2 className="font-bold text-gray-100 mb-5">
        Settings for "
        <Link href={`/${blog.slug}`}>
          <a className="underline">{blog.name}</a>
        </Link>
        "
      </h2>

      <form className="max-w-xl" onSubmit={form.handleSubmit}>
        <div className="">
          <label className="label">Blog Name</label>
          <input
            name="name"
            className="input w-full"
            value={form.values.name}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </div>
        {form.errors.name && form.touched.name && (
          <span className="form-error">{form.errors.name}</span>
        )}

        <div className="mt-3">
          <label className="label">URL</label>
          <div className="flex w-full">
            <span className="input-addon">blogify.dev/</span>
            <input
              name="slug"
              className="input w-full"
              value={form.values.slug}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </div>
        </div>
        {form.errors.slug && form.touched.slug && (
          <span className="form-error">{form.errors.slug}</span>
        )}

        <div className="mt-3">
          <label className="label">Introduction (optional)</label>
          <textarea
            name="introduction"
            className="input textarea w-full"
            value={form.values.introduction}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            rows={10}
          ></textarea>
        </div>
        {form.errors.introduction && form.touched.introduction && (
          <span className="form-error">{form.errors.introduction}</span>
        )}

        <div className="mt-8">
          <Button size="large" variant="primary" isLoading={form.isSubmitting}>
            Update Blog
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}

export default BlogSettings
