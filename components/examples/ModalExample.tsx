'use client'

import { Button } from '@/components/ui/Button'
import { useModal } from '@/hooks/useModal'

/**
 * Example component showing how to use global modal from anywhere
 */
export const ModalExample: React.FC = () => {
  const { showModal, closeModal } = useModal()
  
  const handleOpenConfirmModal = () => {
    showModal({
      title: 'Xác nhận hành động',
      size: 'md',
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Bạn có chắc chắn muốn thực hiện hành động này không?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                // Perform action here
                alert('Đã xác nhận!')
                closeModal()
              }}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      ),
    })
  }
  
  const handleOpenFormModal = () => {
    showModal({
      title: 'Nhập thông tin',
      size: 'lg',
      content: (
        <div>
          <p className="text-gray-600 mb-4">
            Điền thông tin vào form bên dưới:
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              alert('Form đã được submit!')
              closeModal()
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="email@example.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeModal}>
                Hủy
              </Button>
              <Button type="submit">Gửi</Button>
            </div>
          </form>
        </div>
      ),
    })
  }
  
  return (
    <div className="space-y-2">
      <Button onClick={handleOpenConfirmModal}>
        Mở Modal Xác Nhận
      </Button>
      <Button variant="secondary" onClick={handleOpenFormModal}>
        Mở Modal Form
      </Button>
    </div>
  )
}

