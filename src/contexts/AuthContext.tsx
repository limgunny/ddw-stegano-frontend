'use client'

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react'
import { jwtDecode } from 'jwt-decode'

interface User {
  email: string
  role: 'admin' | 'user'
}

interface AuthContextType {
  user: User | null
  login: (token: string) => void
  logout: () => void
  isLoading: boolean
  token: string | null
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const decodedUser: User = jwtDecode(storedToken)
        setUser(decodedUser)
        setToken(storedToken)
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    const decodedUser: User = jwtDecode(token)
    localStorage.setItem('token', token)
    setUser(decodedUser)
    setToken(token)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setToken(null)
  }

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers)
    if (token) {
      headers.append('Authorization', `Bearer ${token}`)
    }
    options.headers = headers

    const response = await fetch(url, options)

    if (response.status === 401) {
      // 토큰이 유효하지 않거나 만료된 경우 자동 로그아웃
      logout()
      // 로그인 페이지로 리디렉션하기 위해 에러를 다시 던집니다.
      throw new Error('Unauthorized')
    }

    return response
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, token, fetchWithAuth }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
