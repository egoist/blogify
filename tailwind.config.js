module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-darker': 'var(--bg-darker)',
        border: 'var(--border-color)',
        accent: 'var(--accent-color)',
        'button-border': 'var(--button-border-color)',
        'button-border-hover': 'var(--button-border-hover-color)',
      },
    },
  },
  variants: {},
  plugins: [],
}
