import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivityPosition: 'bottom-right',
    buildActivity: false,
    appIsrStatus: false,
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
