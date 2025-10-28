// c:\Users\a\Desktop\발표\dct-ddw-watermark\frontend\src\app\page.tsx
'use client'

import { useEffect, useState } from 'react'
import CtaBanner from '@/components/CtaBanner'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'

interface PostType {
  _id: string
  title: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  views: number
  likes: number
  commentCount: number
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState('createdAt') // 'createdAt', 'views', 'likes'
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 15 // 3개씩 5줄

  useEffect(() => {
    const fetchPosts = async () => {
      console.log(process.env.NEXT_PUBLIC_API_URL)
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

  // 페이지네이션 관련
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

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

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-end items-center mb-6">
          <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-lg">
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
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">게시물이 없습니다.</p>
        )}
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  )
}
