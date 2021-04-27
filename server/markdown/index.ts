import Markdown from 'markdown-it'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index'
import removeMarkdown from 'remove-markdown'

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

  const env = {}
  const html = md.render(content, env)
  return {
    html,
    env,
  }
}

export const getExcerpt = (content: string) => {
  const [excerpt] = content.split(/(<!--more-->|\n\n)/)

  return removeMarkdown(excerpt)
}
