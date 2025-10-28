'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface CtaBannerProps {
  category?: string
}

export default function CtaBanner({ category }: CtaBannerProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handleUploadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault()
      alert('로그인이 필요합니다.')
      router.push('/login')
    }
  }

  const uploadHref = category
    ? `/encrypt?category=${encodeURIComponent(category)}`
    : '/encrypt'

  return (
    <div className="text-center p-8 sm:p-12 bg-gray-800/50 rounded-xl m-4 sm:m-6 lg:m-8 border border-gray-700">
      <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-sky-400">
        Dynamic Digital Watermarking
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-gray-300">
        당신의 소중한 저작물 콘텐츠를 보호하세요. 육안으로 식별 불가능한
        워터마크로 <br /> 유출자를 정확히 추적하고, 콘텐츠의 가치를 지킵니다.
      </p>
      <div className="mt-8">
        <Link
          href={uploadHref}
          onClick={handleUploadClick}
          className="inline-block bg-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          업로드
        </Link>
      </div>
    </div>
  )
}
