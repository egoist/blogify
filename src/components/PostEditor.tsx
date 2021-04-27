import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from '@/generated/graphql'
import { loadEditor } from '@/lib/editor'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import * as Yup from 'yup'
import React from 'react'
import { Button } from './Button'
import { BlogInfo, BlogLayout } from './layouts/BlogLayout'

export const PostEditor: React.FC<{
  user: any
  initialTitle: string
  initialContent: string
  initialTags?: string
  initialSlug?: string
  initialCover?: string | null
  postId?: number
  blog: BlogInfo
}> = ({
  user,
  initialTitle,
  initialContent,
  initialTags,
  initialSlug,
  initialCover,
  blog,
  postId,
}) => {
  const router = useRouter()
  const textarea = React.useRef<HTMLTextAreaElement>(null)
  const [
    editor,
    setEditor,
  ] = React.useState<CodeMirror.EditorFromTextArea | null>(null)
  const [, createPostMutation] = useCreatePostMutation()
  const [, updatePostMutation] = useUpdatePostMutation()
  const initEditor = async () => {
    const { CodeMirror } = await loadEditor()
    if (!textarea.current) return
    const editor = CodeMirror.fromTextArea(textarea.current, {
      lineNumbers: false,
      mode: 'markdown',
      theme: 'monokai',
      lineWrapping: true,
      indentWithTabs: false,
    })
    editor.on('change', () => {
      form.setFieldValue('content', editor.getValue())
    })
    setEditor(editor)
  }
  React.useEffect(() => {
    initEditor()
    return () => {
      editor && editor.toTextArea()
    }
  }, [])
  const form = useFormik({
    initialValues: {
      title: initialTitle,
      content: initialContent,
      tags: initialTags || '',
      slug: initialSlug || '',
      cover: initialCover || '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required(),
      content: Yup.string().required(),
      tags: Yup.string().test({
        name: 'tags-limit',
        message: 'too many ${path}',
        test: (value) => value == null || value?.split(',').length <= 10,
      }),
      slug: Yup.string()
        .min(2)
        .max(100)
        .test({
          name: 'allowed-chars',
          message: `Only letters, numbers, dash and underscore are allowed`,
          test: (value) => value == null || /^[a-z0-9_-]+$/i.test(value),
        }),
    }),
    async onSubmit(values) {
      if (postId) {
        const { data } = await updatePostMutation({
          id: postId,
          title: values.title,
          content: values.content,
          tags: values.tags,
          slug: values.slug,
          cover: values.cover,
        })
        if (data) {
          router.push(`/${router.query.blog}/${data.updatePost.slug}`)
        }
      } else {
        const { data } = await createPostMutation({
          blogSlug: router.query.blog as string,
          title: values.title,
          content: values.content,
          tags: values.tags,
          slug: values.slug,
          cover: values.cover,
        })
        if (data) {
          router.push(`/${router.query.blog}/${data.createPost.slug}`)
        }
      }
    },
  })
  return (
    <BlogLayout blog={blog} title={postId ? `Edit post` : `New post`}>
      <form onSubmit={form.handleSubmit}>
        <div className="mb-3">
          <input
            name="title"
            className="input w-full"
            value={form.values.title}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            placeholder="Type title here.."
          />
          {form.errors.title && form.touched.title && (
            <div className="form-error">{form.errors.title}</div>
          )}
        </div>
        <div>
          <textarea
            className="hidden"
            ref={textarea}
            defaultValue={form.values.content}
            placeholder="Write something brilliant.."
          ></textarea>
          {!editor && <div>Loading..</div>}
          {editor && form.errors.content && form.touched.content && (
            <div className="form-error">{form.errors.content}</div>
          )}
        </div>
        <div className="mt-5">
          <label className="block text-sm mb-1 font-bold">Permalink</label>
          <div className="text-xs mb-3 text-gray-500">
            We'll generate the permalink for you if you leave it blank
          </div>
          <div className="flex w-full">
            <span className="input-addon">blogify.dev/{blog.slug}/</span>
            <input
              name="slug"
              type="text"
              className="input with-addon md:w-6/12"
              value={form.values.slug}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </div>
          {form.errors.slug && form.touched.slug && (
            <div className="form-error">{form.errors.slug}</div>
          )}
        </div>
        <div className="mt-5">
          <label className="block text-sm mb-1 font-bold">Cover image</label>
          <div>
            <input
              name="cover"
              type="url"
              className="input md:w-6/12"
              value={form.values.cover}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
            />
          </div>
          {form.errors.cover && form.touched.cover && (
            <div className="form-error">{form.errors.cover}</div>
          )}
        </div>
        <div className="mt-5">
          <label className="text-sm mb-1 font-bold">Tags</label>
          <div className="text-xs mb-3 text-gray-500">
            Allows up to 10 tags, separated by comma
          </div>
          <input
            name="tags"
            className="input md:w-6/12"
            value={form.values.tags}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          {form.errors.tags && form.touched.tags && (
            <div className="form-error">{form.errors.tags}</div>
          )}
        </div>
        {editor && (
          <div className="mt-8 py-8 border-t border-border">
            <Button
              variant="primary"
              size="large"
              isLoading={form.isSubmitting}
            >
              {postId ? 'Update' : 'Create'} Post
            </Button>
          </div>
        )}
      </form>
    </BlogLayout>
  )
}
