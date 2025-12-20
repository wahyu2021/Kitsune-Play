import { FaTrashRestore } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface SettingsDangerZoneProps {
  onResetLibrary: () => void
  onShowConfirm: (title: string, message: string, onConfirm: () => void) => void
  onCloseParent: () => void
}

export default function SettingsDangerZone({
  onResetLibrary,
  onShowConfirm,
  onCloseParent
}: SettingsDangerZoneProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-400">
        {t('settings.danger.title')}
      </h3>
      <button
        onClick={() => {
          onShowConfirm(
            t('settings.danger.confirm_title'),
            t('settings.danger.confirm_msg'),
            () => {
              onResetLibrary()
              onCloseParent()
            }
          )
        }}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 py-3 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
      >
        <FaTrashRestore /> {t('settings.danger.reset_btn')}
      </button>
    </div>
  )
}
