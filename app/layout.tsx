import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ConvexClientProvider from '@/components/ConvexClientProvider'
import Navigation from '@/components/Navigation'
import { Analytics } from "@vercel/analytics/react"
import Footer from '@/components/Footer'


import ConditionalFooter from '@/components/ConditionalFooter';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ITEENS - Competitive Coding Platform',
  description: 'Practice coding problems and compete with other developers',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <Navigation />
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
        <Analytics />
        <ConditionalFooter />
      </body>
    </html>
  )
}