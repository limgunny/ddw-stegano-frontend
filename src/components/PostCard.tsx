import Link from 'next/link'
import {
  EyeIcon,
  HandThumbUpIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/solid'

interface Post {
  _id: string
  title: string
  imageUrl: string
  authorEmail: string
  createdAt: string
  views: number
  likes: number
  commentCount: number
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post._id}`}
      className="group block bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-transparent hover:border-purple-500"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h2 className="absolute bottom-3 left-4 text-xl font-bold text-white truncate w-11/12">
          {post.title}
        </h2>
      </div>
      <div className="p-4 bg-gray-800">
        <p className="text-xs text-gray-400 truncate">by {post.authorEmail}</p>
        <div className="flex justify-between items-center mt-2 text-xs text-gray-300">
          <span className="font-medium">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1" title="조회수">
              <EyeIcon className="w-4 h-4" />
              {post.views}
            </span>
            <span className="flex items-center gap-1" title="추천수">
              <HandThumbUpIcon className="w-4 h-4" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1" title="댓글 수">
              <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
              {post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
