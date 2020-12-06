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
  const env: { cover: string | null; coverAlt: string | null } = {
    cover: '',
    coverAlt: '',
  }

  const tokens = md.parse(content, env)

  // Extract cover image and alt text
  const imageToken = tokens[1] && tokens[1].children && tokens[1].children[0]
  if (imageToken) {
    env.cover = imageToken.attrGet('src')
    env.coverAlt = imageToken.attrGet('alt')
  }

  return env
}
