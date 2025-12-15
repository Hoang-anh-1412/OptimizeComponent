import { useModalStore, ModalConfig } from '@/stores/modalStore'

export const useModal = () => {
  // ✅ Chỉ subscribe vào actions (stable references, không gây re-render)
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)
  
  const showModal = (config: ModalConfig) => {
    console.log('🎯 [useModal] showModal called')
    openModal(config)
  }
  
  const handleCloseModal = () => {
    console.log('🎯 [useModal] closeModal called')
    closeModal()
  }
  
  return {
    showModal,
    closeModal: handleCloseModal,
    // ❌ Bỏ isOpen để tránh re-render không cần thiết
    // Nếu component nào cần isOpen, có thể subscribe trực tiếp:
    // const isOpen = useModalStore((state) => state.isOpen)
  }
}

