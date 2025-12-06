import { useEffect, useRef, useState, useCallback } from 'react'
import { logger } from '../utils/logger'

import bgMusicFile from '../assets/sounds/bg-music.mp3'
import welcomeSoundFile from '../assets/sounds/welcome.mp3'
import hoverSoundFile from '../assets/sounds/hover.mp3'
import selectSoundFile from '../assets/sounds/select.mp3'
import backSoundFile from '../assets/sounds/back.mp3'

interface UseAppSoundsReturn {
  isAudioBlocked: boolean
  playHover: () => void
  playSelect: () => void
  playBack: () => void
}

/**
 * Custom hook to manage application background sounds and UI sound effects.
 * Handles initialization, looping, and cleanup to prevent memory leaks and double-playing.
 *
 * @param isSplashShowing - A boolean indicating if the splash screen is currently displayed.
 * @returns Object containing audio blocked state and SFX playback functions.
 */
export function useAppSounds(isSplashShowing: boolean): UseAppSoundsReturn {
  const bgAudioRef = useRef<HTMLAudioElement | null>(null)
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null)

  // SFX Refs
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null)
  const selectAudioRef = useRef<HTMLAudioElement | null>(null)
  const backAudioRef = useRef<HTMLAudioElement | null>(null)

  const hasInitializedRef = useRef(false)
  const hasPlayedBgMusicRef = useRef(false)

  const [isAudioBlocked, setIsAudioBlocked] = useState(false)

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (hasInitializedRef.current) return
    hasInitializedRef.current = true

    // --- Init BG & Welcome ---
    const bgAudio = new Audio(bgMusicFile)
    bgAudio.loop = true
    bgAudio.volume = 0.15
    bgAudioRef.current = bgAudio

    const welcomeAudio = new Audio(welcomeSoundFile)
    welcomeAudio.volume = 0.6
    welcomeAudioRef.current = welcomeAudio

    // --- Init SFX ---
    // We set volume lower for SFX so they don't blast ears
    const hoverAudio = new Audio(hoverSoundFile)
    hoverAudio.volume = 0.9
    hoverAudioRef.current = hoverAudio

    const selectAudio = new Audio(selectSoundFile)
    selectAudio.volume = 0.9
    selectAudioRef.current = selectAudio

    const backAudio = new Audio(backSoundFile)
    backAudio.volume = 1.0
    backAudioRef.current = backAudio

    const playWelcomeSound = async (): Promise<void> => {
      try {
        logger.debug('Audio', 'Attempting to play welcome sound...')
        await welcomeAudio.play()
        logger.info('Audio', 'Welcome sound playing successfully')
        setIsAudioBlocked(false)
      } catch (err: unknown) {
        const error = err as Error
        // Industry Standard: Differentiate between "Expected Policy Block" and "Real Errors"
        if (error.name === 'NotAllowedError') {
          logger.warn(
            'Audio',
            'Autoplay prevented by browser policy. Waiting for user interaction.'
          )
        } else {
          logger.error('Audio', 'Failed to play welcome sound', error)
        }

        setIsAudioBlocked(true)

        const handleInteraction = (): void => {
          welcomeAudio
            .play()
            .then(() => {
              setIsAudioBlocked(false)
              logger.info('Audio', 'Welcome sound recovered after interaction')
            })
            .catch((e) => logger.error('Audio', 'Retry welcome failed', e))

          window.removeEventListener('click', handleInteraction)
          window.removeEventListener('keydown', handleInteraction)
        }
        window.addEventListener('click', handleInteraction)
        window.addEventListener('keydown', handleInteraction)
      }
    }
    playWelcomeSound()

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause()
        bgAudioRef.current.currentTime = 0
      }
      if (welcomeAudioRef.current) {
        welcomeAudioRef.current.pause()
        welcomeAudioRef.current.currentTime = 0
      }
      const handleInteraction = (): void => {}
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  useEffect(() => {
    if (!isSplashShowing && bgAudioRef.current && !hasPlayedBgMusicRef.current) {
      const playBgMusic = async (): Promise<void> => {
        try {
          await bgAudioRef.current?.play()
          hasPlayedBgMusicRef.current = true
          setIsAudioBlocked(false)
          logger.info('Audio', 'Background music started')
        } catch (err: unknown) {
          const error = err as Error
          if (error.name === 'NotAllowedError') {
            logger.warn('Audio', 'Background music autoplay prevented. Waiting for interaction.')
          } else {
            logger.error('Audio', 'Background music failed', error)
          }

          setIsAudioBlocked(true)

          const handleInteraction = (): void => {
            bgAudioRef.current
              ?.play()
              .then(() => {
                setIsAudioBlocked(false)
                logger.info('Audio', 'Background music started after interaction')
              })
              .catch((e) => logger.error('Audio', 'Retry bg failed', e))
            hasPlayedBgMusicRef.current = true
            window.removeEventListener('click', handleInteraction)
            window.removeEventListener('keydown', handleInteraction)
          }
          window.addEventListener('click', handleInteraction)
          window.addEventListener('keydown', handleInteraction)
        }
      }
      playBgMusic()
    }
  }, [isSplashShowing])

  // Helper to play SFX safely
  // Using cloneNode() allows rapid fire playback (overlapping sounds)
  const playSfx = useCallback(
    (audioRef: React.MutableRefObject<HTMLAudioElement | null>) => {
      if (!audioRef.current || isAudioBlocked) return
      const clone = audioRef.current.cloneNode() as HTMLAudioElement
      clone.volume = audioRef.current.volume
      clone.play().catch((e) => logger.debug('Audio', 'SFX play failed', e))
    },
    [isAudioBlocked]
  )

  return {
    isAudioBlocked,
    playHover: () => playSfx(hoverAudioRef),
    playSelect: () => playSfx(selectAudioRef),
    playBack: () => playSfx(backAudioRef)
  }
}
