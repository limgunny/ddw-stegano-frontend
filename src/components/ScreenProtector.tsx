'use client'

import { useEffect } from 'react'

const ScreenProtector = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      alert('마우스 우클릭은 사용하실 수 없습니다.')
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen, F12, Ctrl+Shift+I (개발자 도구)
      if (
        e.key === 'PrintScreen' ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'i') // Mac 개발자 도구
      ) {
        e.preventDefault()
        alert('화면 캡처 및 개발자 도구 사용이 금지되어 있습니다.')
      }
    }

    // 이벤트 리스너 추가
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return <div className="secure-screen">{children}</div>
}

export default ScreenProtector
