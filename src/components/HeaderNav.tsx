'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function HeaderNav() {
  const { user, logout, isLoading, token } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])
  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      logout()
      router.push('/')
    }
  }

  const handleWithdraw = async () => {
    if (
      window.confirm(
        '정말 탈퇴하시겠습니까? 모든 게시물과 정보가 영구적으로 삭제됩니다.'
      )
    ) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        if (!response.ok) throw new Error('회원 탈퇴에 실패했습니다.')

        alert('회원 탈퇴가 완료되었습니다.')
        logout()
        router.push('/')
      } catch {
        alert('회원 탈퇴 중 오류가 발생했습니다.')
      }
    }
  }

  return (
    <nav className="hidden md:flex items-center space-x-4">
      {!isLoading && (
        <>
          {user ? (
            <>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  {user.email}님
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        관리자 페이지
                      </Link>
                    )}
                    <Link
                      href="/my-posts"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      게시글 모아보기
                    </Link>
                    <button
                      onClick={handleWithdraw}
                      className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-900/40"
                    >
                      회원탈퇴
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </>
      )}
    </nav>
  )
}
