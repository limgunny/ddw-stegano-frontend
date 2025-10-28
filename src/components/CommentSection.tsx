'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Comment {
  _id: string
  authorEmail: string
  content: string
  createdAt: string
}

interface CommentSectionProps {
  postId: string
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user, fetchWithAuth } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`
        )
        if (!response.ok) throw new Error('댓글을 불러오지 못했습니다.')
        const data = await response.json()
        setComments(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchComments()
  }, [postId])

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    const formData = new FormData()
    formData.append('content', newComment)

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
        {
          method: 'POST',
          body: formData,
        }
      )
      if (!response.ok) throw new Error('댓글 작성에 실패했습니다.')
      const savedComment = await response.json()
      setComments([...comments, savedComment])
      setNewComment('')
    } catch (error) {
      console.error(error)
      alert('댓글 작성 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return

    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${commentId}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('댓글 삭제에 실패했습니다.')
      setComments(comments.filter((c) => c._id !== commentId))
    } catch (error) {
      console.error(error)
      alert('댓글 삭제 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="mt-8 pt-8 border-t border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">댓글</h2>
      {/* 댓글 목록 */}
      <div className="space-y-4 mb-6">
        {isLoading && <p className="text-gray-400">댓글을 불러오는 중...</p>}
        {comments.map((comment) => (
          <div key={comment._id} className="bg-gray-700/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold text-purple-300">
                {comment.authorEmail}
              </p>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-300">{comment.content}</p>
            {user &&
              (user.role === 'admin' || user.email === comment.authorEmail) && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-xs text-red-400 hover:text-red-300 mt-2"
                >
                  삭제
                </button>
              )}
          </div>
        ))}
        {!isLoading && comments.length === 0 && (
          <p className="text-gray-400">아직 댓글이 없습니다.</p>
        )}
      </div>
      {/* 댓글 입력 폼 */}
      {user && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
            placeholder="댓글을 입력하세요..."
            required
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            댓글 작성
          </button>
        </form>
      )}
    </div>
  )
}
