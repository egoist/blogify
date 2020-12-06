export const loadEditor = async () => {
  const CodeMirror = await import(/* webpackChunkName: "editor" */ 'codemirror')
  await import(
    /* webpackChunkName: "editor" */ 'codemirror/mode/markdown/markdown'
  )

  return {
    CodeMirror,
  }
}
