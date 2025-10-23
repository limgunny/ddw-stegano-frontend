'use client'

import { useEffect, useState, useRef } from 'react'
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface Post {
  _id: string
  title: string
  content: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  views: number
  likes: number
  isViolation?: boolean
  originalOwnerEmail?: string
}

export default function PostDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token, isLoading: authLoading } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLiked, setHasLiked] = useState(false)
  const effectRan = useRef(false)

  useEffect(() => {
    if (!id) return

    // 사용자의 추천 기록을 localStorage에서 확인합니다.
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
    if (user && likedPosts[user.email]?.includes(id as string)) {
      setHasLiked(true)
    }

    const fetchPost = async () => {
      // StrictMode에서 중복 실행을 방지합니다.
      if (effectRan.current === false) {
        // 조회수 증가 요청 (한 번만 실행)
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/view`, {
          method: 'PUT',
        })

        effectRan.current = true
      }

      try {
        // 게시물 데이터 요청
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`
        )
        if (!response.ok) {
          throw new Error('게시물을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setPost(data)
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

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    if (!token || !post) return
    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        if (!response.ok) {
          throw new Error('게시물 삭제에 실패했습니다.')
        }
        alert('게시물이 삭제되었습니다.')
        router.push('/')
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message)
        } else {
          alert('알 수 없는 오류가 발생했습니다.')
        }
      }
    }
  }

  const handleLike = async () => {
    if (!post || !user || !token) {
      if (!user) {
        alert('추천 기능은 로그인 후 이용 가능합니다.')
        router.push('/login')
      }
      return
    }

    const newHasLiked = !hasLiked
    const originalLikes = post.likes
    const optimisticLikes = newHasLiked
      ? originalLikes + 1
      : Math.max(0, originalLikes - 1)

    // Optimistic UI Update
    setHasLiked(newHasLiked)
    setPost((prev) => (prev ? { ...prev, likes: optimisticLikes } : null))

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/like`,
        {
          method: newHasLiked ? 'PUT' : 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        // Revert optimistic update on error
        setHasLiked(!newHasLiked)
        setPost((prev) => (prev ? { ...prev, likes: originalLikes } : null))
        alert(data.error || '오류가 발생했습니다.')
        return
      }

      // Sync with server response
      setPost((prev) => (prev ? { ...prev, likes: data.likes } : prev))

      // localStorage에 추천 기록 저장/삭제
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}')
      const userLikes = likedPosts[user.email] || []
      if (newHasLiked) {
        likedPosts[user.email] = [...userLikes, id]
      } else {
        likedPosts[user.email] = userLikes.filter(
          (likedId: string) => likedId !== id
        )
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
    } catch (err: unknown) {
      console.error('추천 처리 중 오류 발생:', err)
      // Revert optimistic update on network error
      setHasLiked(!newHasLiked)
      setPost((prev) => (prev ? { ...prev, likes: originalLikes } : null))
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert('알 수 없는 오류가 발생했습니다.')
      }
    }
  }

  if (isLoading || authLoading) {
    return (
      <p className="text-center mt-10 text-gray-400">게시물을 불러오는 중...</p>
    )
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>
  }

  if (!post) {
    return (
      <p className="text-center mt-10 text-gray-400">
        게시물을 찾을 수 없습니다.
      </p>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        {post.isViolation && (
          <div
            className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4"
            role="alert"
          >
            <p className="font-bold">저작권 위반 경고</p>
            <p>
              이 게시물은 원본 저작자의 허락 없이 업로드된 것으로 의심됩니다.
              <br />
              원본 저작자: {post.originalOwnerEmail} <br />
              관련 문의는 관리자 이메일로 부탁드립니다.
            </p>
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
              {post.title}
            </h1>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>작성자: {post.authorEmail}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-auto object-contain rounded-lg bg-black/20"
            />
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 mb-8">
            <p>{post.content}</p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <div className="flex items-center gap-x-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  hasLiked
                    ? 'text-purple-400 font-semibold'
                    : 'text-gray-400 hover:text-purple-400'
                }`}
              >
                <HandThumbUpIcon className="w-5 h-5" />
                <span>추천 ({post.likes})</span>
              </button>
              <span className="flex items-center gap-2 text-gray-400">
                <EyeIcon className="w-5 h-5" />
                <span>조회수 {post.views}</span>
              </span>
            </div>
            {!authLoading &&
              user &&
              (user.role === 'admin' ||
                (!post.isViolation && user.email === post.authorEmail)) && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-700 hover:bg-red-800 transition-colors"
                >
                  삭제
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}
