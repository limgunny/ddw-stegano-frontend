import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DDW - Digital Watermarking',
  description: 'Image watermarking using DCT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.className} flex h-screen`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow overflow-y-auto">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
