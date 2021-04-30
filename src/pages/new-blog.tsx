import { Button } from '@/components/Button'
import { AppLayout } from '@/components/layouts/AppLayout'
import { getServerSession, UserSession } from '@server/auth'
import { blogService } from '@server/services/blog.service'
import { useFormik } from 'formik'
import { GetServerSideProps } from 'next'
import React from 'react'
import { useRouter } from 'next/router'
import { useCreateBlogMutation } from '@/generated/graphql'
import { createSnackbar } from '@snackbar/core'
import * as Yup from 'yup'

type PageProps = {
  hasBlog: boolean
  user: UserSession
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
  const hasBlog = await blogService.hasBlog(user.id)
  return {
    props: {
      user,
      hasBlog,
    },
  }
}

const NewBlog: React.FC<PageProps> = ({ hasBlog, user }) => {
  const router = useRouter()
  const [, createBlogMutation] = useCreateBlogMutation()
  const form = useFormik({
    initialValues: {
      name: '',
      slug: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().min(2).max(20).required(),
      slug: Yup.string()
        .min(2)
        .max(20)
        .matches(/^[a-zA-Z0-9_-]+$/, {
          message: `Only alphabet, numbers, dash and underscore are allowed`,
        })
        .required(),
    }),
    async onSubmit(values) {
      const { data, error } = await createBlogMutation({
        ...values,
      })
      if (data) {
        router.push(`/dashboard/${data.createBlog.slug}`)
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
    <AppLayout title="New Blog">
      {!hasBlog && (
        <h2 className="mb-5 text-xl text-gray-50">
          👋≧◉ᴥ◉≦ Create Your First Blog!
        </h2>
      )}
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
              className="input with-addon w-full"
              value={form.values.slug}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </div>
        </div>
        {form.errors.slug && (
          <span className="form-error">{form.errors.slug}</span>
        )}

        <div className="mt-8">
          <Button size="large" variant="primary" isLoading={form.isSubmitting}>
            Create Blog
          </Button>
        </div>
      </form>
    </AppLayout>
  )
}

export default NewBlog
