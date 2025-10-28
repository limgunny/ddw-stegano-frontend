'use client'

import { useState } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Chat from '@/components/Chat'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-900`}>
        <AuthProvider>
          <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
          <div className="min-h-screen">
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              setSidebarOpen={setSidebarOpen}
              setIsChatOpen={setIsChatOpen}
            />
            <div className="md:pl-64 flex flex-col flex-1">
              <Header
                setSidebarOpen={setSidebarOpen}
                setIsChatOpen={setIsChatOpen}
              />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
