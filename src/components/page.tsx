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
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        내 게시물
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post._id}`}
              className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 bg-white dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
            작성한 게시물이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
