import type Markdown from 'markdown-it'

export const excerptPlugin = (md: Markdown, { paragraphOnly = true } = {}) => {
  md.renderer.rules.paragraph_close = (...args) => {
    const [tokens, idx, options, env, self] = args

    const { __excerpted } = env

    if (!__excerpted) {
      env.__excerpted = true
      let startIndex = 0
      if (paragraphOnly) {
        for (const [index, token] of tokens.entries()) {
          if (token.type === 'paragraph_open') {
            startIndex = index
            break
          }
        }
      }

      env.excerpt = self.render(tokens.slice(startIndex, idx + 1), options, env)
    }

    return self.renderToken(tokens, idx, options)
  }
}
