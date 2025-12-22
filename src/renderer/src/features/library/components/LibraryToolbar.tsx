import { FaSortAlphaDown, FaHistory, FaClock, FaTags, FaEye, FaEyeSlash } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { SortOption } from '../hooks/useLibrary'

interface LibraryToolbarProps {
  sortOption: SortOption
  setSortOption: (option: SortOption) => void
  showHidden: boolean
  setShowHidden: (show: boolean) => void
}

export default function LibraryToolbar({
  sortOption,
  setSortOption,
  showHidden,
  setShowHidden
}: LibraryToolbarProps): React.JSX.Element {
  const { t } = useTranslation()

  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'name', label: t('library.sort_name'), icon: <FaSortAlphaDown /> },
    { value: 'lastPlayed', label: t('library.sort_last_played'), icon: <FaHistory /> },
    { value: 'playtime', label: t('library.sort_playtime'), icon: <FaClock /> },
    { value: 'genre', label: t('library.sort_genre'), icon: <FaTags /> }
  ]

  return (
    <div className="flex w-full items-center justify-end gap-6 px-10 pb-2">
      {/* Sort Options Group */}
      <div className="flex items-center gap-2 rounded-full bg-black/30 p-1 backdrop-blur-md">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSortOption(opt.value)}
            title={opt.label}
            className={`group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
              sortOption === opt.value
                ? 'bg-white text-black shadow-lg scale-110 z-10'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-lg">{opt.icon}</span>
            {/* Tooltip on hover */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 scale-0 rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 whitespace-nowrap">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      <div className="h-6 w-[1px] bg-white/10"></div>

      {/* Show Hidden Toggle */}
      <button
        onClick={() => setShowHidden(!showHidden)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold tracking-wide transition-all backdrop-blur-md ${
          showHidden
            ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/20'
            : 'bg-black/30 text-white/60 hover:bg-white/10 hover:text-white'
        }`}
      >
        <span className="text-lg">{showHidden ? <FaEye /> : <FaEyeSlash />}</span>
        <span>{showHidden ? t('library.hidden_visible') : t('library.hidden_masked')}</span>
      </button>
    </div>
  )
}