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
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
        원본 저작자 확인
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
            암호화된 이미지 업로드
          </label>
          <input
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-700 focus:outline-none placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-sky-500"
        >
          {isLoading ? '복호화 중...' : '메시지 복호화'}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

      {decryptedMessage && (
        <div className="mt-8 text-center bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl text-purple-400 font-semibold mb-2">
            추출된 메시지:
          </h2>
          <p className="text-lg text-gray-300 font-mono break-all">
            {decryptedMessage}
          </p>
        </div>
      )}
    </div>
  )
}
