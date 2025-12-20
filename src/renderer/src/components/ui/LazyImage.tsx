/**
 * @fileoverview Lazy-loading image component with skeleton placeholder.
 * @module renderer/components/ui/LazyImage
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DEFAULT_BANNER } from '@/config'

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  fallback?: string
}

/** Image component with loading skeleton and error fallback. */
export default function LazyImage({
  src,
  alt,
  className,
  fallback = DEFAULT_BANNER
}: LazyImageProps): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 z-0 bg-white/10 backdrop-blur-xl"
        />
      )}

      <motion.img
        src={hasError ? fallback : src}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className="h-full w-full object-cover"
      />
    </div>
  )
}
