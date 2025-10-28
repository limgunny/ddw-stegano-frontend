'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  content: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  views: number
  likes: number
  isViolation: boolean
  originalOwnerEmail?: string
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token, isLoading: authLoading, fetchWithAuth } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasLiked, setHasLiked] = useState(false)
  const viewCounted = useRef(false)

  const postId = params.id

  useEffect(() => {
    if (!postId) return

    const fetchPost = async () => {
      // 조회수 증가 로직을 useEffect 내에서 한 번만 실행되도록 수정
      if (!viewCounted.current) {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/view`,
            { method: 'PUT' }
          )
          viewCounted.current = true
        } catch (err) {
          // 조회수 증가 실패는 치명적인 오류가 아니므로 콘솔에만 기록
          console.error('Failed to increase view count:', err)
        }
      }

      try {
        // 게시물 정보 가져오기
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`
        )
        if (!response.ok) {
          throw new Error('게시물을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
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
  }, [postId])

  useEffect(() => {
    // 사용자의 '좋아요' 상태 확인 (예시: 로컬 스토리지 사용)
    const likedPostsRaw = localStorage.getItem('likedPosts')
    const likedPosts = likedPostsRaw ? JSON.parse(likedPostsRaw) : []

    // likedPosts가 배열인지 확인
    if (user && Array.isArray(likedPosts) && likedPosts.includes(postId)) {
      setHasLiked(true)
    }
  }, [postId, user])

  const handleLike = async () => {
    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    const method = hasLiked ? 'DELETE' : 'PUT'
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`,
        { method }
      )
      if (!response.ok) {
        throw new Error('추천 처리에 실패했습니다.')
      }
      const data = await response.json()
      setPost((prevPost) =>
        prevPost ? { ...prevPost, likes: data.likes } : null
      )
      setHasLiked(!hasLiked)

      // 로컬 스토리지에 '좋아요' 상태 저장
      const likedPostsRaw = localStorage.getItem('likedPosts')
      let likedPosts = likedPostsRaw ? JSON.parse(likedPostsRaw) : []
      if (!Array.isArray(likedPosts)) {
        likedPosts = []
      }

      if (hasLiked) {
        localStorage.setItem(
          'likedPosts',
          JSON.stringify(likedPosts.filter((id: string) => id !== postId))
        )
      } else {
        likedPosts.push(postId)
        localStorage.setItem('likedPosts', JSON.stringify(likedPosts))
      }
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message)
      }
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 이 게시물을 삭제하시겠습니까?')) return

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        { method: 'DELETE' }
      )
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '삭제에 실패했습니다.')
      }
      alert('게시물이 삭제되었습니다.')
      router.push('/')
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message)
      }
    }
  }

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-400">게시물을 불러오는 중...</p>
    )
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!post)
    return (
      <p className="text-center mt-10 text-gray-400">
        게시물을 찾을 수 없습니다.
      </p>
    )

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
              원본 저작자: {post.originalOwnerEmail || '정보 없음'}
            </p>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-auto max-h-[70vh] object-contain bg-black"
        />
        <div className="p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {post.title}
          </h1>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">
            <span>작성자: {post.authorEmail}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="prose prose-invert max-w-none text-gray-300 mb-8">
            <p>{post.content}</p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors ${
                  hasLiked
                    ? 'text-purple-400 font-semibold'
                    : 'text-gray-400 hover:text-purple-400'
                }`}
              >
                <span>👍</span>
                <span>추천 ({post.likes})</span>
              </button>
              <span className="text-gray-500">조회수 {post.views}</span>
            </div>
            {!authLoading &&
              user &&
              (user.role === 'admin' ||
                (user.email === post.authorEmail && !post.isViolation)) && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-400 bg-red-900/50 rounded-md hover:bg-red-800/50 transition-colors"
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
