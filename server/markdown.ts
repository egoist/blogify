import Markdown from 'markdown-it'

// This is used to render markdown to html to display in browser
export const renderMarkdown = (content: string) => {
  const md = new Markdown({
    html: false,
  })

  const env = {}
  const html = md.render(content, env)
  return {
    html,
    env,
  }
}

// This is used to validate markdown (and extract essential info) before saving to database
export const validateMarkdown = (content: string) => {
  const md = new Markdown({
    html: false,
  })
  const env = {}

  md.parse(content, env)

  return env
}
