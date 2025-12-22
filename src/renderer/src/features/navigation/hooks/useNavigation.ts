import { useEffect, useCallback, useState } from 'react'
import { Game } from '@/features/library/types'
import { useGamepad } from '@/hooks/useGamepad'
import { SortOption } from '@/features/library/hooks/useLibrary'

interface UseNavigationProps {
  currentContent: Game[]
  selectedGameId: string
  setSelectedGameId: (id: string) => void
  activeTab: 'games' | 'media'
  onTabChange: (tab: 'games' | 'media') => void
  isAnyModalOpen: boolean
  closeAllModals: () => void
  openSearch: () => void
  onOpenAddGame: () => void
  onOpenProfile: () => void
  onOpenSettings: () => void
  onOpenPower: () => void
  handlePlay: () => void
  handleDelete: () => void
  audio: {
    playHover: () => void
    playSelect: () => void
    playBack: () => void
  }
  showSplash: boolean
  sortOption: SortOption
  setSortOption: (opt: SortOption) => void
  showHidden: boolean
  setShowHidden: (show: boolean) => void
}

interface UseNavigationReturn {
  navRow: number
  navCol: number
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
  onOpenAddGame,
  onOpenProfile,
  onOpenSettings,
  onOpenPower,
  handlePlay,
  handleDelete,
  audio: { playHover, playSelect, playBack },
  showSplash,
  sortOption,
  setSortOption,
  showHidden,
  setShowHidden
}: UseNavigationProps): UseNavigationReturn {
  // Row 0: TopBar [Games, Media, Add, Search, Settings, Profile, Power]
  // Row 1: Toolbar [Sort, Hidden]
  // Row 2: GameList
  const [navRow, setNavRow] = useState(2)
  const [navCol, setNavCol] = useState(0)

  // Reset to GameList when content changes or tab switches
  useEffect(() => {
    if (currentContent.length > 0) {
      setNavRow(2)
    }
  }, [activeTab, currentContent.length])
  const handleNavUp = useCallback((): void => {
    if (navRow > 0) {
      playHover()
      setNavRow((prev) => prev - 1)
      setNavCol(0) // Reset col when changing rows for simplicity, or keep memory if improved
    }
  }, [navRow, playHover])

  const handleNavDown = useCallback((): void => {
    if (navRow < 2 && currentContent.length > 0) {
      playHover()
      setNavRow((prev) => prev + 1)
      setNavCol(0)
    }
  }, [navRow, currentContent, playHover])

  const handleNavRight = useCallback((): void => {
    playHover()
    if (navRow === 2) {
      // Game List
      if (currentContent.length === 0) return
      const currentIndex = currentContent.findIndex((g) => g.id === selectedGameId)
      const nextIndex = (currentIndex + 1) % currentContent.length
      setSelectedGameId(currentContent[nextIndex].id)
    } else if (navRow === 0) {
      // Top Bar (7 items)
      setNavCol((prev) => (prev + 1) % 7)
    } else if (navRow === 1) {
      // Toolbar (2 items)
      setNavCol((prev) => (prev + 1) % 2)
    }
  }, [navRow, currentContent, selectedGameId, playHover, setSelectedGameId])

  const handleNavLeft = useCallback((): void => {
    playHover()
    if (navRow === 2) {
      // Game List
      if (currentContent.length === 0) return
      const currentIndex = currentContent.findIndex((g) => g.id === selectedGameId)
      const prevIndex = (currentIndex - 1 + currentContent.length) % currentContent.length
      setSelectedGameId(currentContent[prevIndex].id)
    } else if (navRow === 0) {
      // Top Bar (7 items)
      setNavCol((prev) => (prev - 1 + 7) % 7)
    } else if (navRow === 1) {
      // Toolbar (2 items)
      setNavCol((prev) => (prev - 1 + 2) % 2)
    }
  }, [navRow, currentContent, selectedGameId, playHover, setSelectedGameId])

  const handleGamepadBack = useCallback(() => {
    if (isAnyModalOpen) {
      playBack()
      closeAllModals()
    } else if (navRow !== 2) {
      // If in menu, go back to games
      playBack()
      setNavRow(2)
    }
  }, [isAnyModalOpen, navRow, playBack, closeAllModals])

  const handleToggleHidden = useCallback(() => {
    setShowHidden(!showHidden)
  }, [showHidden, setShowHidden])

  const handleCycleSort = useCallback(() => {
    const options: SortOption[] = ['name', 'lastPlayed', 'playtime', 'genre']
    const currentIndex = options.indexOf(sortOption)
    const nextIndex = (currentIndex + 1) % options.length
    setSortOption(options[nextIndex])
  }, [sortOption, setSortOption])

  const handleSelect = useCallback(() => {
    playSelect()
    if (navRow === 2) {
      if (!isAnyModalOpen) handlePlay()
    } else if (navRow === 1) {
      if (navCol === 0) handleCycleSort()
      if (navCol === 1) handleToggleHidden()
    } else if (navRow === 0) {
      switch (navCol) {
        case 0:
          onTabChange('games')
          break
        case 1:
          onTabChange('media')
          break
        case 2:
          onOpenAddGame()
          break
        case 3:
          openSearch()
          break
        case 4:
          onOpenSettings()
          break
        case 5:
          onOpenProfile()
          break
        case 6:
          onOpenPower()
          break
      }
    }
  }, [
    navRow,
    navCol,
    isAnyModalOpen,
    handlePlay,
    handleCycleSort,
    handleToggleHidden,
    onTabChange,
    onOpenAddGame,
    openSearch,
    onOpenSettings,
    onOpenProfile,
    onOpenPower,
    playSelect
  ])

  useGamepad(
    {
      onNavigateLeft: handleNavLeft,
      onNavigateRight: handleNavRight,
      onNavigateUp: handleNavUp,
      onNavigateDown: handleNavDown,
      onSelect: handleSelect,
      onBack: handleGamepadBack,
      onSearch: () => {
        playSelect()
        openSearch()
      },
      onTabSwitch: () => {
        playHover()
        onTabChange(activeTab === 'games' ? 'media' : 'games')
      },
      onToggleHidden: () => {
        playSelect()
        handleToggleHidden()
      },
      onCycleSort: () => {
        playHover()
        handleCycleSort()
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

      if (e.key === 'ArrowUp') handleNavUp()
      if (e.key === 'ArrowDown') handleNavDown()
      if (e.key === 'ArrowRight') handleNavRight()
      if (e.key === 'ArrowLeft') handleNavLeft()
      if (e.key === 'Enter') handleSelect()

      if (e.ctrlKey && e.key === 'f') {
        playSelect()
        openSearch()
      } else if (e.key === 'Tab') {
        e.preventDefault()
        playHover()
        onTabChange(activeTab === 'games' ? 'media' : 'games')
      } else if (e.key === 'Delete') {
        handleDelete()
      } else if (e.ctrlKey && e.key === 'h') {
        playSelect()
        handleToggleHidden()
      } else if (e.ctrlKey && e.key === 's') {
        playHover()
        handleCycleSort()
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
    handleNavUp,
    handleNavDown,
    handleSelect,
    openSearch,
    closeAllModals,
    handleToggleHidden,
    handleCycleSort
  ])

  return { navRow, navCol }
}
