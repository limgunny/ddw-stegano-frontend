'use client'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon,
  DocumentMagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

export default function Header() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      logout()
      router.push('/')
    }
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <Link
          href="/"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400"
        >
          DDW
        </Link>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {!isLoading && (
          <>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <HomeIcon className="h-5 w-5" />홈
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <InformationCircleIcon className="h-5 w-5" />
              소개
            </Link>
            {user ? (
              <>
                <div className="group relative py-2">
                  <span className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
                    <UserCircleIcon className="h-5 w-5" />
                    {user.email}님
                  </span>
                  <div className="absolute hidden group-hover:block left-0 mt-1 w-full min-w-max bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-10">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        관리자 페이지
                      </Link>
                    )}
                    <Link
                      href="/my-posts"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      게시글 모아보기
                    </Link>
                    <Link
                      href="/withdraw"
                      className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-900/50"
                    >
                      회원탈퇴
                    </Link>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-2 space-y-2">
                  <Link
                    href="/encrypt"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <ArrowUpTrayIcon className="h-5 w-5" />
                    업로드
                  </Link>
                  <Link
                    href="/decrypt"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <DocumentMagnifyingGlassIcon className="h-5 w-5" />
                    원본 저작자 확인
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </>
        )}
      </nav>
      {user && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 m-4 rounded-md text-sm font-medium text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
        >
          로그아웃
        </button>
      )}
      <footer className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          &copy; 2024 DDW. All rights reserved.
        </p>
      </footer>
    </aside>
  )
}
