/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
const { extendDefaultPlugins } = require('svgo')

module.exports = {
  nextConfig,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: { and: [/\.(js|ts|md|jsx)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: {
                        active: false
                      }
                    }
                  }
                }
              ]
            },
            titleProp: true
          }
        }
      ]
    })

    return config
  }
}
