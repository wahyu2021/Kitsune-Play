import { useState, useEffect } from 'react'
import { Game } from '@/features/library/types'
import { fetchGameMetadata } from '@/services/rawg'

interface UseAddGameFormProps {
  editGame?: Game | null
  onAddGame: (game: Game) => void
  onClose: () => void
  apiKey?: string
}

interface UseAddGameFormReturn {
  formData: Partial<Game>
  isFetching: boolean
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleAutoFill: () => Promise<void>
  handleBrowse: (field: keyof Game, extensions: string[]) => Promise<void>
  handleSubmit: (e: React.FormEvent) => void
}

export function useAddGameForm({
  editGame,
  onAddGame,
  onClose,
  apiKey
}: UseAddGameFormProps): UseAddGameFormReturn {
  const [isFetching, setIsFetching] = useState(false)

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

  // Populate form when Edit Mode is active or Reset when Add Mode
  useEffect(() => {
    if (editGame) {
      setFormData(editGame)
    } else {
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
    }
  }, [editGame])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAutoFill = async (): Promise<void> => {
    if (!formData.title || !apiKey) return

    setIsFetching(true)
    const metadata = await fetchGameMetadata(formData.title, apiKey)
    setIsFetching(false)

    if (metadata) {
      setFormData((prev) => ({
        ...prev,
        description: metadata.description || prev.description,
        genre: metadata.genre || prev.genre,
        cover_image: metadata.cover_image || prev.cover_image,
        bg_image: metadata.bg_image || prev.bg_image
      }))
    }
  }

  const handleBrowse = async (field: keyof Game, extensions: string[]): Promise<void> => {
    try {
      const filePath = await window.api.selectFile([{ name: 'Files', extensions }])

      if (filePath) {
        let finalPath = filePath

        if (field === 'cover_image' || field === 'bg_image' || field === 'bg_video') {
          finalPath = `file://${filePath.replace(/\\/g, '/')}`
        }

        setFormData((prev) => {
          const updates: Partial<Game> = { [field]: finalPath }

          // Auto-fill executableName if browsing for exe and field is empty
          if (field === 'path_to_exe' && !prev.executableName) {
            const fileName = filePath.split(/[/\\]/).pop() // Extract 'Game.exe'
            if (fileName) {
              updates.executableName = fileName
            }
          }

          return { ...prev, ...updates }
        })
      }
    } catch (error) {
      console.error('[AddGameModal] Error opening dialog:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (formData.title && formData.path_to_exe) {
      const newGame: Game = {
        id: editGame ? editGame.id : Date.now().toString(),
        title: formData.title || 'Untitled',
        description: formData.description || '',
        genre: formData.genre || 'Unknown',
        path_to_exe: formData.path_to_exe || '',
        cover_image: formData.cover_image || '',
        bg_image: formData.bg_image || '',
        bg_video: formData.bg_video || '',
        launchArgs: formData.launchArgs || '',
        executableName: formData.executableName || ''
      }
      onAddGame(newGame)
      onClose()
    }
  }

  return {
    formData,
    isFetching,
    handleChange,
    handleAutoFill,
    handleBrowse,
    handleSubmit
  }
}
