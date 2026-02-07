/**
 * @fileoverview Form logic hook for add/edit media app modal.
 * Extends game form with auto-fill from coding apps presets.
 * @module renderer/features/library/hooks/useAddMediaForm
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Game } from '@/features/library/types'
import {
  CodingAppPreset,
  searchCodingAppPresets,
  findCodingAppPreset
} from '@/features/library/data/codingAppsPresets'

interface UseAddMediaFormProps {
  editGame?: Game | null
  onAddGame: (game: Game) => void
  onClose: () => void
}

interface UseAddMediaFormReturn {
  formData: Partial<Game>
  suggestions: CodingAppPreset[]
  showSuggestions: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleSelectSuggestion: (preset: CodingAppPreset) => void
  handleAutoFillFromTitle: () => void
  handleBrowse: (field: keyof Game, extensions: string[]) => Promise<void>
  handleSubmit: (e: React.FormEvent) => void
  resetForm: () => void
  closeSuggestions: () => void
}

/** Manages form state and actions for the add/edit media modal with preset auto-fill. */
export function useAddMediaForm({
  editGame,
  onAddGame,
  onClose
}: UseAddMediaFormProps): UseAddMediaFormReturn {
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [formData, setFormData] = useState<Partial<Game>>({
    title: '',
    description: '',
    genre: '',
    path_to_exe: '',
    cover_image: '',
    bg_image: '',
    bg_video: '',
    launchArgs: '',
    executableName: ''
  })

  const resetForm = useCallback((): void => {
    setFormData({
      title: '',
      description: '',
      genre: '',
      path_to_exe: '',
      cover_image: '',
      bg_image: '',
      bg_video: '',
      launchArgs: '',
      executableName: ''
    })
    setShowSuggestions(false)
  }, [])

  useEffect(() => {
    if (editGame) {
      setFormData(editGame)
    } else {
      resetForm()
    }
  }, [editGame, resetForm])

  // Compute suggestions based on title
  const suggestions = useMemo(() => {
    if (!formData.title || formData.title.length < 2) return []
    return searchCodingAppPresets(formData.title).slice(0, 8)
  }, [formData.title])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      // Show suggestions when typing in title field
      if (name === 'title' && value.length >= 2) {
        setShowSuggestions(true)
      } else if (name === 'title') {
        setShowSuggestions(false)
      }
    },
    []
  )

  const handleSelectSuggestion = useCallback((preset: CodingAppPreset): void => {
    setFormData((prev) => ({
      ...prev,
      title: preset.name,
      description: preset.description,
      genre: preset.genre,
      cover_image: preset.icon
    }))
    setShowSuggestions(false)
  }, [])

  const handleAutoFillFromTitle = useCallback((): void => {
    if (!formData.title) return

    const preset = findCodingAppPreset(formData.title)
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        description: preset.description,
        genre: preset.genre,
        cover_image: preset.icon
      }))
    }
    setShowSuggestions(false)
  }, [formData.title])

  const closeSuggestions = useCallback((): void => {
    setShowSuggestions(false)
  }, [])

  const handleBrowse = useCallback(
    async (field: keyof Game, extensions: string[]): Promise<void> => {
      try {
        const filePath = await window.api.selectFile([{ name: 'Files', extensions }])

        if (filePath) {
          let finalPath = filePath

          if (field === 'cover_image' || field === 'bg_image' || field === 'bg_video') {
            finalPath = `file://${filePath.replace(/\\/g, '/')}`
          }

          setFormData((prev) => {
            const updates: Partial<Game> = { [field]: finalPath }

            if (field === 'path_to_exe' && !prev.executableName) {
              const fileName = filePath.split(/[/\\]/).pop()
              if (fileName) {
                updates.executableName = fileName
              }
            }

            return { ...prev, ...updates }
          })
        }
      } catch (error) {
        console.error('[AddMediaModal] Error opening dialog:', error)
      }
    },
    []
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault()
      if (formData.title && formData.path_to_exe) {
        const newMedia: Game = {
          id: editGame ? editGame.id : crypto.randomUUID(),
          title: formData.title || 'Untitled',
          description: formData.description || '',
          genre: formData.genre || 'Application',
          path_to_exe: formData.path_to_exe || '',
          cover_image: formData.cover_image || '',
          bg_image: formData.bg_image || '',
          bg_video: formData.bg_video || '',
          launchArgs: formData.launchArgs || '',
          executableName: formData.executableName || ''
        }
        onAddGame(newMedia)
        onClose()
      }
    },
    [formData, editGame, onAddGame, onClose]
  )

  return {
    formData,
    suggestions,
    showSuggestions,
    handleChange,
    handleSelectSuggestion,
    handleAutoFillFromTitle,
    handleBrowse,
    handleSubmit,
    resetForm,
    closeSuggestions
  }
}
