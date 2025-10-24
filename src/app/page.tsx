// c:\Users\a\Desktop\발표\dct-ddw-watermark\frontend\src\app\page.tsx
'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`
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
  }, [])

  if (isLoading)
    return <p className="text-center mt-10">게시물을 불러오는 중...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="container mx-auto">
      <div className="text-center p-8 sm:p-12 bg-gray-800/50 rounded-xl m-4 sm:m-6 lg:m-8 border border-gray-700">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
          Dynamic Digital Watermarking
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-gray-300">
          당신의 소중한 저작물 콘텐츠를 보호하세요. 육안으로 식별 불가능한
          워터마크로 유출자를 정확히 추적하고, 콘텐츠의 가치를 지킵니다.
        </p>
        <div className="mt-8">
          <Link
            href="/encrypt"
            className="inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            업로드
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) =>
            post.imageUrl ? (
              <Link
                href={`/posts/${post._id}`}
                key={post._id}
                className="group block bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-transparent hover:border-purple-500"
              >
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h2 className="absolute bottom-2 left-4 text-lg font-semibold text-white truncate w-11/12">
                    {post.title}
                  </h2>
                </div>
                <div className="p-4 bg-gray-800">
                  <p className="text-xs text-gray-400 truncate">
                    by {post.authorEmail}
                  </p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
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
