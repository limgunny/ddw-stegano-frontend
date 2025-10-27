import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
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
    <html lang="ko" className="h-full bg-gray-900">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="flex h-full">
            <Sidebar />
            <main className="flex-grow pl-64 overflow-y-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
