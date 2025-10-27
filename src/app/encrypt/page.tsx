'use client'

import { useState, FormEvent, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function EncryptPage() {
  const { user, token, isLoading: authIsLoading } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const categories = ['학습', '일러스트', '자연', '동물', '일상', '기타']

  useEffect(() => {
    if (!authIsLoading && !user) {
      alert('로그인이 필요한 서비스입니다.')
      router.push('/login')
    }
  }, [user, authIsLoading, router])

  if (authIsLoading || !user) {
    return (
      <p className="text-center mt-10 text-gray-400">
        사용자 정보를 확인하는 중...
      </p>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 1 * 1024 * 1024) {
        // 1MB
        setError('이미지 파일 크기는 1MB를 초과할 수 없습니다.')
        setFile(null)
        setPreview(null)
        return
      }
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setError(null)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || !title || !content || !category) {
      setError('이미지, 제목, 내용, 카테고리를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image', file)
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

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '게시물 생성에 실패했습니다.')
      }

      // Redirect to the main page on success
      router.push('/')
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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
        창작물 업로드
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow-md"
      >
        <div className="mb-6">
          <label
            htmlFor="image"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            원본 이미지 업로드
          </label>
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg, .jpg, .jpeg, .JPG, .JPEG"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none placeholder-gray-400"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-300 mb-2">
                이미지 미리보기:
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Image preview"
                className="max-h-48 rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
            placeholder="게시물 제목을 입력하세요"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="category"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            카테고리
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
            required
          >
            <option value="">카테고리를 선택하세요</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block mb-2 text-sm font-medium text-gray-300"
          >
            내용
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
            placeholder="게시물 내용을 입력하세요"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isLoading || !file || !title || !content || !category}
          className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-sky-500"
        >
          {isLoading ? '업로드 중...' : '게시물 생성'}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  )
}
