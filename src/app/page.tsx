// c:\Users\a\Desktop\발표\dct-ddw-watermark\frontend\src\app\page.tsx
'use client'

import { useEffect, useState } from 'react'
import CtaBanner from '@/components/CtaBanner'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  views: number
  likes: number
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState('createdAt') // 'createdAt', 'views', 'likes'

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?sort=${sortOrder}`
        )
        if (!response.ok) {
          throw new Error('게시물을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setPosts(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('알 수 없는 오류가 발생했습니다.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [sortOrder])

  const sortOptions = [
    { key: 'createdAt', label: '최신순' },
    { key: 'views', label: '조회수순' },
    { key: 'likes', label: '추천순' },
  ]

  const getSortButtonClass = (key: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      sortOrder === key
        ? 'bg-purple-600 text-white shadow-md'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-400">게시물을 불러오는 중...</p>
    )
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="container mx-auto">
      <CtaBanner />

      <div className="p-4 sm:p-6 lg:p-8 pt-0">
        <div className="flex justify-end items-center mb-6 px-2">
          <div className="flex items-center gap-2 p-1 bg-gray-800/50 rounded-lg">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSortOrder(option.key)}
                className={getSortButtonClass(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) =>
            post.imageUrl ? (
              <Link
                href={`/posts/${post._id}`}
                key={post._id}
                className="group block bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-gray-700 hover:border-purple-500"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-2 left-4 text-lg font-semibold text-white truncate w-11/12 group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h2>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400 truncate">
                    by {post.authorEmail}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                    <span className="font-medium">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1" title="조회수">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                          <path
                            fillRule="evenodd"
                            d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1" title="추천수">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M1 8.25a1.25 1.25 0 1 1 2.5 0v7.5a1.25 1.25 0 1 1-2.5 0v-7.5ZM11 3V1.7c0-.268.14-.516.371-.647A.748.748 0 0 1 12.06.94l3.536 3.535a.75.75 0 0 1 0 1.06l-3.536 3.536a.749.749 0 0 1-1.29-.53v-1.3H9.25a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v6a3 3 0 0 0 3 3h1.25a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3h1.25v1.3c0 .414.502.659.82.329l3.536-3.535a.75.75 0 0 0 0-1.06L12.82.328A.749.749 0 0 0 12.06 0H12v.001a.752.752 0 0 0-.19.043C11.588.182 11 .472 11 1.001V3Z" />
                        </svg>
                        {post.likes}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
