/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
        // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
        config.resolve.fallback = {
            fs: false
        }
    }

    return config;
  }
}

module.exports = nextConfig
