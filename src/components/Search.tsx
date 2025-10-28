'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function Search() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('') // 검색 후 입력창 초기화
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
      </div>
      <input
        id="search"
        name="search"
        className="block w-full rounded-md border-0 bg-gray-700 py-2 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6"
        placeholder="이미지 제목 검색"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  )
}
