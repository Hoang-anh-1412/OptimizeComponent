import { create } from 'zustand'

export interface ModalConfig {
  title?: string
  content: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClose?: () => void
  showCloseButton?: boolean
}

interface ModalState {
  isOpen: boolean
  config: ModalConfig | null
  openModal: (config: ModalConfig) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  config: null,
  openModal: (config) => {
    console.log('🔓 [ModalStore] openModal called')
    set({ isOpen: true, config })
  },
  closeModal: () => {
    console.log('🔒 [ModalStore] closeModal called')
    set((state) => {
      // Call onClose callback if provided
      if (state.config?.onClose) {
        console.log('📞 [ModalStore] Calling onClose callback')
        state.config.onClose()
      }
      return { isOpen: false, config: null }
    })
  },
}))

