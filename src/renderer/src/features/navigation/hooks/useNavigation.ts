import { useEffect, useCallback } from 'react'
import { Game } from '@/features/library/types'
import { useGamepad } from '@/hooks/useGamepad'

interface UseNavigationProps {
  currentContent: Game[]
  selectedGameId: string
  setSelectedGameId: (id: string) => void
  activeTab: 'games' | 'media'
  onTabChange: (tab: 'games' | 'media') => void
  isAnyModalOpen: boolean
  closeAllModals: () => void
  openSearch: () => void
  handlePlay: () => void
  handleDelete: () => void
  audio: {
    playHover: () => void
    playSelect: () => void
    playBack: () => void
  }
  showSplash: boolean
}

export function useNavigation({
  currentContent,
  selectedGameId,
  setSelectedGameId,
  activeTab,
  onTabChange,
  isAnyModalOpen,
  closeAllModals,
  openSearch,
  handlePlay,
  handleDelete,
  audio: { playHover, playSelect, playBack },
  showSplash
}: UseNavigationProps): void {
  const handleNavRight = useCallback((): void => {
    if (currentContent.length === 0) return
    const currentIndex = currentContent.findIndex((g) => g.id === selectedGameId)
    const nextIndex = (currentIndex + 1) % currentContent.length
    playHover()
    setSelectedGameId(currentContent[nextIndex].id)
  }, [currentContent, selectedGameId, playHover, setSelectedGameId])

  const handleNavLeft = useCallback((): void => {
    if (currentContent.length === 0) return
    const currentIndex = currentContent.findIndex((g) => g.id === selectedGameId)
    const prevIndex = (currentIndex - 1 + currentContent.length) % currentContent.length
    playHover()
    setSelectedGameId(currentContent[prevIndex].id)
  }, [currentContent, selectedGameId, playHover, setSelectedGameId])

  const handleGamepadBack = useCallback(() => {
    if (isAnyModalOpen) {
      playBack()
      closeAllModals()
    }
  }, [isAnyModalOpen, playBack, closeAllModals])

  useGamepad(
    {
      onNavigateLeft: handleNavLeft,
      onNavigateRight: handleNavRight,
      onSelect: () => {
        playSelect()
        if (!isAnyModalOpen) {
          handlePlay()
        }
      },
      onBack: handleGamepadBack,
      onSearch: () => {
        playSelect()
        openSearch()
      },
      onTabSwitch: () => {
        playHover()
        onTabChange(activeTab === 'games' ? 'media' : 'games')
      }
    },
    !showSplash
  )

  useEffect(() => {
    // Block input while splash is showing
    if (showSplash) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isAnyModalOpen) {
        if (e.key === 'Escape') {
          playBack()
          closeAllModals()
        }
        return
      }

      if (currentContent.length === 0) {
        if (e.key === 'Tab') {
          e.preventDefault()
          onTabChange(activeTab === 'games' ? 'media' : 'games')
        }
        return
      }

      if (e.key === 'ArrowRight') {
        handleNavRight()
      } else if (e.key === 'ArrowLeft') {
        handleNavLeft()
      } else if (e.key === 'Enter') {
        playSelect()
        handlePlay()
      } else if (e.ctrlKey && e.key === 'f') {
        playSelect()
        openSearch()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        playHover()
        onTabChange(activeTab === 'games' ? 'media' : 'games')
      } else if (e.key === 'Delete') {
        handleDelete()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedGameId,
    currentContent,
    activeTab,
    isAnyModalOpen,
    handlePlay,
    handleDelete,
    onTabChange,
    showSplash,
    playHover,
    playSelect,
    playBack,
    handleNavRight,
    handleNavLeft,
    openSearch,
    closeAllModals
  ])
}
