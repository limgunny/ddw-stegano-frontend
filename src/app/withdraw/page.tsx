'use client'

import { useState, FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function WithdrawPage() {
  const { token, logout } = useAuth()
  const router = useRouter()
  const [confirmationText, setConfirmationText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (confirmationText !== 'delete') {
      setError('"delete"를 정확히 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '회원 탈퇴에 실패했습니다.')
      }

      alert(data.message || '회원 탈퇴가 처리되었습니다.')
      logout()
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-md border border-gray-700">
        <h1 className="text-3xl font-bold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">
          회원 탈퇴
        </h1>
        <p className="text-center text-gray-400 mb-6">
          회원 탈퇴를 진행하면 계정과 관련된 모든 데이터가 삭제되며, 복구할 수
          없습니다. 저작권 위반 기록이 있는 경우, 해당 기록은 법적 근거에 따라
          보관될 수 있습니다.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="confirmation"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              탈퇴를 확정하시려면 아래에 "delete"를 입력해주세요.
            </label>
            <input
              type="text"
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 placeholder-gray-500"
              placeholder="delete"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || confirmationText !== 'delete'}
            className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            {isLoading ? '처리 중...' : '계정 영구 삭제'}
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </form>
      </div>
    </div>
  )
}
