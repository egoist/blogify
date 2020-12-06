import limax from 'limax'

export const slugify = (str: string) =>
  limax(str, {
    tone: false,
  })
