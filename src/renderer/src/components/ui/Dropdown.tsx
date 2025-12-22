import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

/** Represents a single option in the dropdown menu. */
interface Option {
  label: string
  value: string
}

interface DropdownProps {
  /** Array of options to display. */
  options: Option[]
  /** Currently selected value. */
  value: string
  /** Callback fired when an option is selected. */
  onChange: (value: string) => void
  /** Placeholder text when no option is selected. */
  placeholder?: string
}

/**
 * Custom styled dropdown component with Framer Motion animations.
 * Mimics the PS5 UI aesthetic.
 */
export default function Dropdown({
  options,
  value,
  onChange,
  placeholder
}: DropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative min-w-[150px]" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10 ${isOpen ? 'bg-white/10 ring-1 ring-white/30' : ''}`}
      >
        <span>{selectedOption ? selectedOption.label : placeholder || 'Select...'}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FaChevronDown className="text-white/60" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-full min-w-[180px] overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a]/95 p-1 shadow-xl backdrop-blur-xl"
          >
            {options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  value === option.value
                    ? 'bg-white text-black'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
