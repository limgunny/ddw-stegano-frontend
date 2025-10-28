'use client'
import Link from 'next/link'
import {
  Bars3Icon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/solid'
import HeaderNav from './HeaderNav'
import { useAuth } from '@/contexts/AuthContext'

export default function Header({
  setSidebarOpen,
  setIsChatOpen,
}: {
  setSidebarOpen: (isOpen: boolean) => void
  setIsChatOpen: (isOpen: boolean) => void
}) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-700 bg-gray-900/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      {/* Mobile Logo */}
      <div className="md:hidden">
        <Link
          href="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400"
        >
          DDW
        </Link>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 items-center justify-end gap-4">
        {user && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700"
            aria-label="채팅 열기"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6" />
          </button>
        )}
        <div className="h-6 w-px bg-gray-600" />
        <div>
          <HeaderNav />
        </div>
      </div>
    </header>
  )
}
