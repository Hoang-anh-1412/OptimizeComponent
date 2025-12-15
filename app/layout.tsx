import type { Metadata } from 'next'
import './globals.css'
import { GlobalModal } from '@/components/GlobalModal'

export const metadata: Metadata = {
  title: 'Component Showcase - Next.js & Tailwind',
  description: 'A collection of reusable UI components built with Next.js and Tailwind CSS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        {children}
        <GlobalModal />
      </body>
    </html>
  )
}

