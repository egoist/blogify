module.exports = {
  purge: ['./src/**/*.tsx'],
  theme: {
    extend: {
      colors: {
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
