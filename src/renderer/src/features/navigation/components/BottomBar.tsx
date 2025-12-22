import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { MdKeyboardReturn } from 'react-icons/md'
import { useTranslation } from 'react-i18next'

export default function BottomBar(): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="mt-4 flex w-full items-center justify-start border-t border-white/10 pt-6">
      <div className="flex gap-10">
        {/* Select Action */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/30">
            <MdKeyboardReturn className="text-lg text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            {t('bottom_bar.play')}
          </span>
        </div>

        {/* Navigation Action */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 items-center gap-2 rounded-full bg-white/10 px-3 backdrop-blur-sm ring-1 ring-white/30">
            <FaArrowLeft className="text-xs text-white" />
            <div className="h-3 w-[1px] bg-white/30"></div>
            <FaArrowRight className="text-xs text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/60">
            {t('bottom_bar.navigate')}
          </span>
        </div>
      </div>
    </div>
  )
}
