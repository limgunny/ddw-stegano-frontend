'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface CtaButtonProps {
  className?: string
  authText: string
  guestText: string
}

export default function CtaButton({
  className,
  authText,
  guestText,
}: CtaButtonProps) {
  const { user } = useAuth()
  const href = user ? '/upload' : '/login'
  const text = user ? authText : guestText

  return (
    <Link href={href} className={className}>
      {text}
    </Link>
  )
}
