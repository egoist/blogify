module.exports = {
  webpack(config, { dev, isServer }) {
    // Use ts-loader for decorators support
    for (const rule of config.module.rules) {
      if (rule.test && rule.test.test('foo.ts')) {
        rule.use = [].concat(rule.use, {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        })
      }
    }

    // Replace React with Preact in client production build
    // if (!dev && !isServer) {
    //   Object.assign(config.resolve.alias, {
    //     react: 'preact/compat',
    //     'react-dom/test-utils': 'preact/test-utils',
    //     'react-dom': 'preact/compat',
    //   })
    // }

    return config
  },

  async rewrites() {
    return [
      {
        source: '/:blog/atom.xml',
        destination: '/api/feed/:blog',
      },
    ]
  },
}
