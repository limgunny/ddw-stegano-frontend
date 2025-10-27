'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function EncryptPage() {
  const { user, token, isLoading: authIsLoading } = useAuth()
  const router = useRouter()

  const [image, setImage] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('일상')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!authIsLoading && !user) {
    router.push('/login')
    return null
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!image || !title || !content || !category) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', image)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category', category)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || '업로드에 실패했습니다.')
      }

      alert('게시물이 성공적으로 업로드되었습니다.')
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
          새 게시물 작성
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              내용
            </label>
            <textarea
              id="content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-purple-500 focus:border-purple-500"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
            >
              <option>학습</option>
              <option>일러스트</option>
              <option>자연</option>
              <option>동물</option>
              <option>일상</option>
              <option>기타</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="image"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              이미지 업로드
            </label>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              required
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              PNG, JPG 파일을 업로드하세요.
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-purple-800"
          >
            {isLoading ? '업로드 중...' : '게시물 생성'}
          </button>
          {error && (
            <p className="text-red-500 dark:text-red-400 mt-4 text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
