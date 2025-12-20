import { useState, useCallback } from 'react'
import { Game } from '@/features/library/types'
import { ModalType } from '@/components/ui'

export interface ModalConfig {
  isOpen: boolean
  title: string
  message: string
  type: ModalType
  onConfirm?: () => void
}

export function useAppModals() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isPowerModalOpen, setIsPowerModalOpen] = useState(false)
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null)

  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm })
  }, [])

  const closeAllModals = useCallback(() => {
    setIsSearchModalOpen(false)
    setIsSettingsModalOpen(false)
    setIsAddModalOpen(false)
    setIsProfileModalOpen(false)
    setIsPowerModalOpen(false)
    setModalConfig((prev) => ({ ...prev, isOpen: false }))
    setGameToEdit(null)
  }, [])

  const openAddGameModal = useCallback((game: Game | null = null) => {
    setGameToEdit(game)
    setIsAddModalOpen(true)
  }, [])

  const isAnyModalOpen =
    isAddModalOpen ||
    isProfileModalOpen ||
    isSearchModalOpen ||
    isSettingsModalOpen ||
    isPowerModalOpen ||
    modalConfig.isOpen

  return {
    isAddModalOpen,
    setIsAddModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isPowerModalOpen,
    setIsPowerModalOpen,
    gameToEdit,
    setGameToEdit,
    modalConfig,
    setModalConfig,
    showConfirm,
    closeAllModals,
    openAddGameModal,
    isAnyModalOpen
  }
}
