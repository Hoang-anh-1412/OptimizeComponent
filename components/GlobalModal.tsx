'use client'

import React, { useEffect } from 'react'
import { useModalStore } from '@/stores/modalStore'

export const GlobalModal: React.FC = () => {
  const { isOpen, config, closeModal } = useModalStore()
  
  // Log khi component render
  useEffect(() => {
    console.log('🟢 [GlobalModal] Component rendered - isOpen:', isOpen)
  })
  
  // Log khi modal state thay đổi
  useEffect(() => {
    console.log('🟡 [GlobalModal] Modal state changed - isOpen:', isOpen, 'hasConfig:', !!config)
  }, [isOpen, config])
  
  // Log khi component mount
  useEffect(() => {
    console.log('🔵 [GlobalModal] Component mounted')
    return () => {
      console.log('🔴 [GlobalModal] Component unmounted')
    }
  }, [])
  
  useEffect(() => {
    if (isOpen) {
      console.log('📂 [GlobalModal] Opening modal - setting body overflow hidden')
      document.body.style.overflow = 'hidden'
    } else {
      console.log('📂 [GlobalModal] Closing modal - resetting body overflow')
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])
  
  if (!isOpen || !config) return null
  
  const sizes: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }
  
  const showCloseButton = config.showCloseButton !== false
  const modalSize: 'sm' | 'md' | 'lg' | 'xl' = config.size || 'md'
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className={`bg-white rounded-lg shadow-xl ${sizes[modalSize]} w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {(config.title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b">
            {config.title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {config.title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-6">{config.content}</div>
      </div>
    </div>
  )
}

