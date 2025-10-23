'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Post {
  _id: string
  title: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  isViolation?: boolean
}

export default function MyPostsPage() {
  const { user, token, isLoading: authIsLoading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login')
      return
    }

    if (token) {
      const fetchPosts = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/posts`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if (!response.ok) {
            throw new Error('게시물을 불러오는데 실패했습니다.')
          }
          const data = await response.json()
          setPosts(data)
        } catch (error) {
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchPosts()
    }
  }, [user, token, authIsLoading, router])

  if (isLoading || authIsLoading) {
    return <p className="text-center mt-10">내 게시물을 불러오는 중...</p>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
        내 게시물
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => {
            const handleDelete = async (e: React.MouseEvent) => {
              e.preventDefault()
              e.stopPropagation()
              if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
                try {
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}`,
                    {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}))
                    throw new Error(
                      errorData.error || '게시물 삭제에 실패했습니다.'
                    )
                  }
                  setPosts(posts.filter((p) => p._id !== post._id))
                } catch (err: unknown) {
                  if (err instanceof Error) {
                    alert(err.message)
                  } else {
                    alert('게시물 삭제 중 오류가 발생했습니다.')
                  }
                }
              }
            }

            return (
              <div
                key={post._id}
                className="relative group bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-transform hover:-translate-y-1"
              >
                <Link href={`/posts/${post._id}`} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-100 truncate group-hover:text-purple-400 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                </Link>
                <div className="absolute top-2 right-2">
                  {user?.role === 'admin' ? (
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                      aria-label="게시물 삭제"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  ) : post.isViolation ? (
                    <span className="inline-block bg-red-900/70 text-red-300 text-xs font-semibold px-2 py-1 rounded-full">
                      삭제 불가
                    </span>
                  ) : (
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors"
                      aria-label="게시물 삭제"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <p className="col-span-full text-center text-gray-400">
            작성한 게시물이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
