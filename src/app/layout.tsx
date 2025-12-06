import React from 'react'
import { Inter } from 'next/font/google'
import '@/app/globals.css'

// Configure Inter to load only the weights we use and to use font-display: swap
// Update the `weight` list if you need additional weights (e.g. '500', '600').
export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Primary favicon (SVG) + modern image fallbacks we already have in public/images */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* Legacy fallback for older browsers */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/avif" href="/images/rain.avif" />
        <link rel="icon" type="image/webp" href="/images/rain.webp" />
        {/* Note: browsers that expect /favicon.ico will request it automatically if present. */}
      </head>
      <body className={`${inter.className} min-h-screen antialiased`}>{children}</body>
    </html>
  )
}