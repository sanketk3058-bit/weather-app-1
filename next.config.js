/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration options
}

// Conditionally enable bundle analyzer when ANALYZE=true
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)