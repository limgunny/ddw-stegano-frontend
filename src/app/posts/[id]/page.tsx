'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, HandThumbUpIcon } from '@heroicons/react/24/solid'
import CommentSection from '@/components/CommentSection'

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

export default function PostPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, fetchWithAuth } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        // 조회수 증가 요청
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/view`, {
          method: 'PUT',
        })

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`,
        )
        if (!response.ok) {
          throw new Error('게시물을 불러오는데 실패했습니다.')
        }
        const data = await response.json()
        setPost(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleDelete = async () => {
    if (!post || !window.confirm('정말 이 게시물을 삭제하시겠습니까?')) return

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '게시물 삭제에 실패했습니다.')
      }

      alert('게시물이 삭제되었습니다.')
      router.push('/')
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류 발생')
    }
  }

  const handleLike = async () => {
    if (!user || !post) {
      alert('로그인이 필요합니다.')
      return
    }

    const method = isLiked ? 'DELETE' : 'PUT'
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/like`,
        { method },
      )
      if (!response.ok) throw new Error('추천 처리에 실패했습니다.')

      const data = await response.json()
      setPost({ ...post, likes: data.likes })
      setIsLiked(!isLiked)
    } catch (err) {
      alert(err instanceof Error ? err.message : '알 수 없는 오류 발생')
    }
  }

  if (isLoading)
    return <p className="text-center mt-10">게시물을 불러오는 중...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!post)
    return <p className="text-center mt-10">게시물을 찾을 수 없습니다.</p>

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-white mb-2">{post.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
            <span>by {post.authorEmail}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div
            className="text-gray-300 leading-relaxed break-all"
            dangerouslySetInnerHTML={{
              __html: post.content.replace(/\n/g, '<br />'),
            }}
          />
        </div>

        {post.isViolation && (
          <div className="bg-red-900/70 p-4 text-center text-white">
            <p className="font-bold">⚠️ 저작권 위반 경고 ⚠️</p>
            <p className="text-sm">
              이 이미지는 원본 저작자({post.originalOwnerEmail})의 허락 없이
              업로드되었습니다.
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
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors ${
                isLiked
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <HandThumbUpIcon className="w-10 h-10" />
              <span className="font-semibold text-lg">{post.likes}</span>
            </button>
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center gap-4 text-gray-400">
              <span className="flex items-center gap-1.5">
                <EyeIcon className="w-5 h-5" />
                {post.views}
              </span>
            </div>
            {user && (user.role === 'admin' || user.email === post.authorEmail) && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-semibold"
              >
                삭제
              </button>
            </div>
          )}
          {/* 댓글 섹션 */}
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  )
}