'use client'
import Link from 'next/link'
import { Bars3Icon } from '@heroicons/react/24/solid'
import HeaderNav from './HeaderNav'

export default function Header({
  isSidebarOpen,
  setSidebarOpen,
}: {
  isSidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-700 bg-gray-900/50 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
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
        <Link href="/" className="text-xl font-bold text-white">
          DDW
        </Link>
      </div>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-end">
        <HeaderNav />
      </div>
    </header>
  )
}
