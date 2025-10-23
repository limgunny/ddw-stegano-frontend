'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const navLinkClasses = (path: string) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      pathname === path
        ? 'bg-gray-900 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`

  return (
    <header className="bg-sky-600 text-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          DDW
        </Link>
        <div className="flex space-x-4">
          <Link href="/encrypt" className={navLinkClasses('/encrypt')}>
            Encrypt
          </Link>
          <Link href="/decrypt" className={navLinkClasses('/decrypt')}>
            Decrypt
          </Link>
        </div>
      </nav>
    </header>
  )
}
