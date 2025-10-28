'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  HomeIcon,
  InformationCircleIcon,
  ArrowUpTrayIcon,
  DocumentMagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  SparklesIcon,
  EllipsisHorizontalCircleIcon,
  ChevronUpIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import { PaintBrushIcon } from '@heroicons/react/24/solid'

const mainNav = [
  { name: '홈', href: '/', icon: HomeIcon },
  { name: '소개', href: '/about', icon: InformationCircleIcon },
]

const userNav = [
  { name: '업로드', href: '/encrypt', icon: ArrowUpTrayIcon },
  {
    name: '원본 저작자 확인',
    href: '/decrypt',
    icon: DocumentMagnifyingGlassIcon,
  },
]

const categories = [
  { name: '학습', href: '/category/학습', icon: AcademicCapIcon },
  { name: '일러스트', href: '/category/일러스트', icon: PaintBrushIcon },
  { name: '자연', href: '/category/자연', icon: SunIcon },
  { name: '동물', href: '/category/동물', icon: SparklesIcon },
  { name: '일상', href: '/category/일상', icon: UserCircleIcon }, // Changed icon to avoid duplication
  { name: '기타', href: '/category/기타', icon: EllipsisHorizontalCircleIcon },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Sidebar({
  isSidebarOpen,
  setSidebarOpen,
}: {
  isSidebarOpen: boolean
  setSidebarOpen: (isOpen: boolean) => void
}) {
  const { user, logout, isLoading, token, fetchWithAuth } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      logout()
      router.push('/')
    }
  }

  const handleWithdraw = async () => {
    if (
      !window.confirm(
        '정말 탈퇴하시겠습니까? 저작권 위반 기록이 없는 경우, 모든 게시물과 정보가 영구적으로 삭제됩니다.'
      )
    ) {
      return
    }
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        { method: 'DELETE' }
      )
      const data = await response.json()
      if (!response.ok)
        throw new Error(data.message || '회원 탈퇴에 실패했습니다.')

      alert(data.message || '회원 탈퇴가 완료되었습니다.')
      logout()
      router.push('/')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : '회원 탈퇴 중 오류가 발생했습니다.'
      alert(message)
    }
  }

  return (
    <>
      {/* Mobile backdrop (appears when sidebar is open on small screens) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/80 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar content */}
      <div
        className={classNames(
          'flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 w-64 border-r border-gray-700',
          'fixed top-0 bottom-0 z-50 transform transition-transform ease-in-out duration-300',
          isSidebarOpen ? 'block' : 'hidden', // Control visibility on mobile
          'md:flex', // Always flex on medium screens and up
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full', // Mobile: slides in/out
          'md:translate-x-0' // Desktop: always in place
        )}
      >
        <div className="flex h-16 shrink-0 items-center">
          <Link
            href="/"
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400"
          >
            DDW
          </Link>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-5">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {mainNav.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        pathname === item.href
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative transition-colors duration-200'
                      )}
                    >
                      {pathname === item.href && (
                        <span
                          className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-r-lg"
                          aria-hidden="true"
                        />
                      )}
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {user && (
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {userNav.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={classNames(
                          pathname === item.href
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative transition-colors duration-200'
                        )}
                      >
                        {pathname === item.href && (
                          <span
                            className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-r-lg"
                            aria-hidden="true"
                          />
                        )}
                        <item.icon className="h-6 w-6 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            )}
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                카테고리
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {categories.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={classNames(
                        decodeURIComponent(pathname) === item.href
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold relative transition-colors duration-200'
                      )}
                    >
                      {decodeURIComponent(pathname) === item.href && (
                        <span
                          className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-r-lg"
                          aria-hidden="true"
                        />
                      )}
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto" ref={menuRef}>
              {isLoading ? (
                <div className="text-gray-400 text-sm p-2">로딩 중...</div>
              ) : user ? (
                <div className="group relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-full flex items-center justify-between gap-x-3 p-2 text-sm font-semibold leading-6 text-gray-300 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="truncate">{user.email}</span>
                    <ChevronUpIcon
                      className={`h-5 w-5 shrink-0 transition-transform ${
                        isUserMenuOpen ? 'rotate-0' : 'rotate-180'
                      }`}
                    />
                  </button>
                  <div
                    className={`absolute bottom-full mb-2 w-full bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black/5 z-10 transition-all duration-200 ease-in-out ${
                      isUserMenuOpen
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <Cog6ToothIcon className="h-5 w-5" />
                        관리자
                      </Link>
                    )}
                    {user && (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        로그아웃
                      </button>
                    )}
                    <Link
                      href="/my-posts"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      내 게시물
                    </Link>
                    <button
                      onClick={handleWithdraw}
                      className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                    >
                      회원탈퇴
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/login"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" />
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <UserPlusIcon className="h-6 w-6 shrink-0" />
                    회원가입
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
