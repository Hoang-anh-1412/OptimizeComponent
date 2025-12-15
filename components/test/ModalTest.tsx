'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useModal } from '@/hooks/useModal'

/**
 * Component test để kiểm tra re-render khi mở/đóng modal
 */
export const ModalTest: React.FC = () => {
  const { showModal, closeModal, isOpen } = useModal()
  
  // Log khi component render
  useEffect(() => {
    console.log('🟢 [ModalTest] Component rendered')
  })
  
  // Log khi modal state thay đổi
  useEffect(() => {
    console.log('🟡 [ModalTest] Modal state changed - isOpen:', isOpen)
  }, [isOpen])
  
  // Log khi component mount
  useEffect(() => {
    console.log('🔵 [ModalTest] Component mounted')
    return () => {
      console.log('🔴 [ModalTest] Component unmounted')
    }
  }, [])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Modal Re-render</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Mở console để xem logs khi mở/đóng modal
          </p>
          <p className="text-xs text-gray-500">
            Modal state: {isOpen ? 'OPEN' : 'CLOSED'}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                console.log('👆 [ModalTest] Button clicked - Opening modal')
                showModal({
                  title: 'Test Modal',
                  size: 'md',
                  content: (
                    <div>
                      <p className="text-gray-600 mb-4">
                        Kiểm tra console để xem các component có re-render không
                      </p>
                      <Button onClick={closeModal}>Đóng Modal</Button>
                    </div>
                  ),
                })
              }}
            >
              Mở Modal
            </Button>
            <Button variant="outline" onClick={closeModal}>
              Đóng Modal (từ bên ngoài)
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

