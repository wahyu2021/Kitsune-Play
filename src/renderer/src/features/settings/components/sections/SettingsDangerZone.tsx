import { FaTrashRestore } from 'react-icons/fa'

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
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-400">Danger Zone</h3>
      <button
        onClick={() => {
          onShowConfirm(
            'Reset Library',
            'Are you sure you want to reset your library?\n\nThis will remove all games and settings. This action cannot be undone.',
            () => {
              onResetLibrary()
              onCloseParent()
            }
          )
        }}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 py-3 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
      >
        <FaTrashRestore /> Reset Library to Defaults
      </button>
    </div>
  )
}
