import { HTMLAttributes } from 'react'

export default function DDWLogo({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`text-2xl font-bold text-purple-600 ${className}`}
      {...props}
    >
      DDW
    </div>
  )
}
