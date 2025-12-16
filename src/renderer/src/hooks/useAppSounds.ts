import { useEffect, useRef, useState, useCallback } from 'react'
import { logger } from '@/utils/logger'

import bgMusicFile from '@/assets/sounds/bg-music.mp3'
import welcomeSoundFile from '@/assets/sounds/welcome.mp3'
import hoverSoundFile from '@/assets/sounds/hover.mp3'
import selectSoundFile from '@/assets/sounds/select.mp3'
import backSoundFile from '@/assets/sounds/back.mp3'

interface UseAppSoundsReturn {
  isAudioBlocked: boolean
  playHover: () => void
  playSelect: () => void
  playBack: () => void
  startAudio: () => void
}

/**
 * Custom hook to manage application background sounds and UI sound effects.
 * Handles initialization, looping, and cleanup to prevent memory leaks and double-playing.
 * Use optimized playback (rewind instead of cloning) for better performance.
 */
export function useAppSounds(
  isSplashShowing: boolean,
  bgMusicVolume: number = 0.3,
  sfxVolume: number = 0.8,
  isMuted: boolean = false
): UseAppSoundsReturn {
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null)

  // SFX Refs
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)
  const selectAudioRef = useRef<HTMLAudioElement | null>(null)
  const backAudioRef = useRef<HTMLAudioElement | null>(null)

  const hasInitializedRef = useRef(false)
  const hasPlayedBgMusicRef = useRef(false)
  const wasPlayingRef = useRef(false)

  const [isAudioBlocked, setIsAudioBlocked] = useState(false)

  // --- Update Volumes & Mute State ---
  useEffect(() => {
    const bgVol = isMuted ? 0 : bgMusicVolume
    const sfxVol = isMuted ? 0 : sfxVolume
    const welcomeVol = isMuted ? 0 : 0.6

    if (bgAudioRef.current) bgAudioRef.current.volume = bgVol
    if (welcomeAudioRef.current) welcomeAudioRef.current.volume = welcomeVol

    if (hoverAudioRef.current) hoverAudioRef.current.volume = sfxVol
    if (selectAudioRef.current) selectAudioRef.current.volume = sfxVol
    if (backAudioRef.current) backAudioRef.current.volume = sfxVol
  }, [bgMusicVolume, sfxVolume, isMuted])

  // --- Window Focus/Blur Handler (Auto-Mute) ---
  useEffect(() => {
    const handleBlur = (): void => {
      if (bgAudioRef.current && !bgAudioRef.current.paused) {
        bgAudioRef.current.pause()
        wasPlayingRef.current = true
      }
    }

    const handleFocus = (): void => {
      if (wasPlayingRef.current && bgAudioRef.current && !isSplashShowing) {
        bgAudioRef.current.play().catch(() => {})
        wasPlayingRef.current = false
      }
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isSplashShowing])

  // --- Manual Start Audio ---
  const startAudio = useCallback(() => {
    if (welcomeAudioRef.current) {
      welcomeAudioRef.current.play().catch((e) => logger.warn('Audio', 'Welcome play failed', e))
    }
  }, [])

  useEffect(() => {
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    const bgAudio = new Audio(bgMusicFile)
    bgAudio.loop = true
    bgAudioRef.current = bgAudio

    const welcomeAudio = new Audio(welcomeSoundFile)
    welcomeAudioRef.current = welcomeAudio

    const hoverAudio = new Audio(hoverSoundFile)
    hoverAudioRef.current = hoverAudio

    const selectAudio = new Audio(selectSoundFile)
    selectAudioRef.current = selectAudio

    const backAudio = new Audio(backSoundFile)
    backAudioRef.current = backAudio

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        bgAudioRef.current.currentTime = 0
      }
    }
  }, [])

  // Play BG Music after splash is gone
  useEffect(() => {
    if (!isSplashShowing && bgAudioRef.current && !hasPlayedBgMusicRef.current) {
      const playBgMusic = async (): Promise<void> => {
        try {
          await bgAudioRef.current?.play()
          hasPlayedBgMusicRef.current = true
          setIsAudioBlocked(false)
        } catch {
          setIsAudioBlocked(true)
        }
      }
      playBgMusic()
    }
  }, [isSplashShowing])

  const playSfx = useCallback((audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (!audioRef.current) return
    // Optimized: Rewind and play instead of cloning (saves memory & CPU)
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }, [])

  return {
    isAudioBlocked,
    startAudio,
    playHover: () => playSfx(hoverAudioRef),
    playSelect: () => playSfx(selectAudioRef),
    playBack: () => playSfx(backAudioRef)
  }
}
