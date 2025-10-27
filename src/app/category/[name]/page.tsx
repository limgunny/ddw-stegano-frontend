'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import PostCard from '@/components/PostCard'
interface Post {
  _id: string
  title: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  views: number
  likes: number
  category: string
}

export default function CategoryPage() {
  const params = useParams()
  const categoryName = decodeURIComponent(params.name as string)

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState('createdAt')

  useEffect(() => {
    if (!categoryName) return

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts?category=${categoryName}&sort=${sortOrder}`
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
  }, [categoryName, sortOrder])

  const sortOptions = [
    { key: 'createdAt', label: '최신순' },
    { key: 'views', label: '조회수순' },
    { key: 'likes', label: '추천순' },
  ]

  const getSortButtonClass = (key: string) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      sortOrder === key
        ? 'bg-purple-600 text-white'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-white mb-2">{categoryName}</h1>
      <p className="text-gray-400 mb-8">
        {categoryName} 카테고리의 게시물 목록입니다.
      </p>

      <div className="flex justify-end items-center mb-6 px-2">
        <div className="flex items-center gap-2 p-1 bg-gray-900/50 rounded-lg">
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

      {isLoading ? (
        <p className="text-center mt-10">게시물을 불러오는 중...</p>
      ) : error ? (
        <p className="text-center mt-10 text-red-500">{error}</p>
      ) : posts.length === 0 ? (
        <p className="text-center mt-10 text-gray-400">
          해당 카테고리에 게시물이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
