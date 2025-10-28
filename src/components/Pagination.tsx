'use client'

interface PaginationProps {
  postsPerPage: number
  totalPosts: number
  paginate: (pageNumber: number) => void
  currentPage: number
}

export default function Pagination({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
}: PaginationProps) {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }

  if (pageNumbers.length <= 1) {
    return null
  }

  return (
    <nav className="mt-12">
      <ul className="flex justify-center items-center gap-2">
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === number
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
