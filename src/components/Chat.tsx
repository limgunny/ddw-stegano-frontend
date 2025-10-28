'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { io, Socket } from 'socket.io-client'
import {
  XMarkIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'

interface ChatUser {
  email: string
  name: string
}

interface Message {
  _id?: string
  sender: string
  receiver: string
  content: string
  createdAt: string
}

interface ChatProps {
  isOpen: boolean
  onClose: () => void
}

export default function Chat({ isOpen, onClose }: ChatProps) {
  const { user, fetchWithAuth } = useAuth()
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const socket = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ChatUser[]>([])

  useEffect(() => {
    if (!isOpen || !user) return

    // Socket.IO 연결
    socket.current = io(
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
    )

    socket.current.on('connect', () => {
      console.log('Socket connected')
      // 서버에 자신의 이메일로 룸에 참여
      socket.current?.emit('join', { email: user.email })
    })

    socket.current.on('receive_message', (message: Message) => {
      // 현재 보고 있는 채팅방의 메시지만 업데이트
      if (
        (message.sender === user.email &&
          message.receiver === selectedUser?.email) ||
        (message.sender === selectedUser?.email &&
          message.receiver === user.email)
      ) {
        setMessages((prev) => [...prev, message])
      }
    })

    return () => {
      socket.current?.disconnect()
      console.log('Socket disconnected')
    }
  }, [isOpen, user, fetchWithAuth, selectedUser?.email])

  useEffect(() => {
    // 메시지 목록이 변경될 때마다 스크롤을 맨 아래로 이동
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    try {
      const response = await fetchWithAuth(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/chat/search-user?email=${encodeURIComponent(searchQuery)}`
      )
      if (!response.ok) throw new Error('사용자 검색에 실패했습니다.')
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error(error)
      setSearchResults([])
    }
  }

  const handleUserSelect = async (chatUser: ChatUser) => {
    setSelectedUser(chatUser)
    // 선택된 사용자와의 대화 기록 불러오기
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/api/chat/history/${chatUser.email}`
      )
      if (!response.ok) throw new Error('Failed to fetch chat history')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error(error)
      setMessages([])
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser || !user) return

    const messageData = {
      sender: user.email,
      receiver: selectedUser.email,
      content: newMessage,
      createdAt: new Date().toISOString(),
    }

    socket.current?.emit('send_message', messageData)
    setNewMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-gray-800 w-full max-w-4xl h-[80vh] rounded-lg shadow-xl flex">
        {/* User List */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700 flex-shrink-0">
            <h2 className="text-white text-lg font-semibold mb-2">
              대화 상대 검색
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이메일로 검색"
                className="flex-1 bg-gray-700 text-white rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                className="p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>
          </div>
          <ul className="overflow-y-auto flex-1">
            {searchResults.length === 0 && searchQuery && (
              <p className="p-4 text-gray-400 text-sm">검색 결과가 없습니다.</p>
            )}
            {searchResults.map((u) => (
              <li key={u.email}>
                <button
                  onClick={() => handleUserSelect(u)}
                  className={`w-full text-left p-4 hover:bg-gray-700 ${
                    selectedUser?.email === u.email ? 'bg-purple-900/50' : ''
                  }`}
                >
                  <p className="text-white font-medium">{u.name}</p>
                  <p className="text-gray-400 text-sm truncate">{u.email}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat Window */}
        <div className="w-2/3 flex flex-col">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-white text-lg font-semibold">
                  {selectedUser.name}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === user?.email
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                        msg.sender === user?.email
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-700 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-gray-700 text-white rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="메시지를 입력하세요..."
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
              <p>대화 상대를 선택해주세요.</p>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
