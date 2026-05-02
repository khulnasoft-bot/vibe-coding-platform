import type { NextConfig } from 'next'
import { withBotId } from 'botid/next/config'

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.md/,
      type: 'asset/source',
    })

    // Bundle optimization: split chunks for client
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      }
    }

    return config
  },
  turbopack: {
    rules: {
      '*.md': {
        loaders: ['raw-loader'],
        as: '*.js',
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vercel.com',
        port: '',
        pathname: '/api/www/avatar/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle analyzer (uncomment to analyze)
  // experimental: {
  //   instrumentationHook: true,
  // },
}

export default withBotId(nextConfig)
