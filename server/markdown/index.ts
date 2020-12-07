import Markdown from 'markdown-it'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index'
import { excerptPlugin } from './excerpt-plugin'

// This is used to render markdown to html to display in browser
export const renderMarkdown = (content: string) => {
  const md = new Markdown({
    html: false,
    highlight: (code, lang) => {
      lang = lang || 'markup'
      loadLanguages([lang])
      const grammer = Prism.languages[lang]
      return Prism.highlight(code, grammer, lang)
    },
  })

  md.use(excerptPlugin)

  const env: { excerpt: string } = { excerpt: '' }
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
