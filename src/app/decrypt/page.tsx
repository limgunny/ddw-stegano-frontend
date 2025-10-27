'use client'

import { useState, FormEvent } from 'react'

export default function DecryptPage() {
  const [image, setImage] = useState<File | null>(null)
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
      setDecryptedMessage(null) // Reset previous result
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!image) {
      setError('이미지를 업로드해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)
    setDecryptedMessage(null)

    const formData = new FormData()
    formData.append('image', image)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/decrypt`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '복호화에 실패했습니다.')
      }
      setDecryptedMessage(data.message)
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
          원본 저작자 확인
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="image"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              워터마크를 확인할 이미지 업로드
            </label>
            <input
              type="file"
              id="image"
              accept="image/png, image/jpeg"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              PNG, JPG 파일을 업로드하세요.
            </p>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-sky-400 dark:disabled:bg-sky-800"
          >
            {isLoading ? '확인 중...' : '워터마크 확인'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 dark:text-red-400 mt-4 text-center">
            {error}
          </p>
        )}

        {decryptedMessage && (
          <div className="mt-8 text-center bg-gray-50 dark:bg-gray-900/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl text-purple-600 dark:text-purple-400 font-semibold mb-2">
              탐지 결과
            </h2>
            <p className="text-lg text-gray-800 dark:text-gray-300 font-mono break-all">
              {decryptedMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
