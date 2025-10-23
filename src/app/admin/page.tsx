'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Violation {
  _id: string
  title: string
  createdAt: string
  violator: {
    email: string
    name: string
    phone: string
  }
}

export default function AdminPage() {
  const { user, token, isLoading: authIsLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [violations, setViolations] = useState<Violation[]>([])
  const [violationsLoading, setViolationsLoading] = useState(true)

  useEffect(() => {
    if (!authIsLoading && user?.role !== 'admin') {
      alert('관리자만 접근할 수 있습니다.')
      router.push('/')
    }

    if (token) {
      const fetchViolations = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/violations`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          if (!response.ok) {
            throw new Error('위반 목록을 불러오는데 실패했습니다.')
          }
          const data = await response.json()
          setViolations(data)
        } catch (err: any) {
          setError(err.message)
        } finally {
          setViolationsLoading(false)
        }
      }
      fetchViolations()
    }
  }, [user, authIsLoading, router, token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('권한을 부여할 사용자의 이메일을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append('email', email)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/set-role`,
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
        throw new Error(data.error || '권한 부여에 실패했습니다.')
      }

      setSuccess(data.message)
      setEmail('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (authIsLoading || user?.role !== 'admin') {
    return <p className="text-center mt-10">권한을 확인하는 중...</p>
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
          관리자 페이지
        </h1>
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto bg-gray-800 p-8 rounded-lg shadow-md"
        >
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              관리자 권한 부여
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-gray-400"
              placeholder="사용자 이메일 입력"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-sky-600 hover:bg-sky-700 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-sky-500"
          >
            {isLoading ? '처리 중...' : '권한 부여'}
          </button>
        </form>
        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-400 mt-4 text-center">{success}</p>
        )}
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
          저작권 위반 목록
        </h2>
        {violationsLoading ? (
          <p className="text-center text-gray-400">
            위반 목록을 불러오는 중...
          </p>
        ) : violations.length > 0 ? (
          <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
            <table className="min-w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    게시물 제목
                  </th>
                  <th scope="col" className="px-6 py-3">
                    유출자 이메일
                  </th>
                  <th scope="col" className="px-6 py-3">
                    이름
                  </th>
                  <th scope="col" className="px-6 py-3">
                    전화번호
                  </th>
                  <th scope="col" className="px-6 py-3">
                    업로드 날짜
                  </th>
                  <th scope="col" className="px-6 py-3">
                    게시물
                  </th>
                </tr>
              </thead>
              <tbody>
                {violations.map((v) => (
                  <tr
                    key={v._id}
                    className="border-b border-gray-700 hover:bg-gray-600/50"
                  >
                    <td className="px-6 py-4 font-medium text-white">
                      {v.title}
                    </td>
                    <td className="px-6 py-4">{v.violator.email}</td>
                    <td className="px-6 py-4">{v.violator.name}</td>
                    <td className="px-6 py-4">{v.violator.phone}</td>
                    <td className="px-6 py-4">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/posts/${v._id}`}
                        className="font-medium text-sky-400 hover:underline"
                      >
                        보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400">
            저작권 위반 게시물이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}
