/**
 * @fileoverview Modal state management hook.
 * @module renderer/hooks/useAppModals
 */

import React, { useState, useCallback } from 'react'
import { Game } from '@/features/library/types'
import { ModalType } from '@/components/ui'

export interface ModalConfig {
  isOpen: boolean
  title: string
  message: string
  type: ModalType
  onConfirm?: () => void
}

interface UseAppModalsReturn {
  isAddModalOpen: boolean
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isProfileModalOpen: boolean
  setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSearchModalOpen: boolean
  setIsSearchModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSettingsModalOpen: boolean
  setIsSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isPowerModalOpen: boolean
  setIsPowerModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  gameToEdit: Game | null
  setGameToEdit: React.Dispatch<React.SetStateAction<Game | null>>
  modalConfig: ModalConfig
  setModalConfig: React.Dispatch<React.SetStateAction<ModalConfig>>
  showConfirm: (title: string, message: string, onConfirm: () => void) => void
  closeAllModals: () => void
  openAddGameModal: (game: Game | null) => void
  isAnyModalOpen: boolean
}

/** Centralized modal state management for the application. */
export function useAppModals(): UseAppModalsReturn {
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
