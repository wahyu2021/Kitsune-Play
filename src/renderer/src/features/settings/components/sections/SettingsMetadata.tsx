import { useState, useEffect } from 'react'
import { FaKey, FaExternalLinkAlt, FaSave } from 'react-icons/fa'

interface SettingsMetadataProps {
  apiKey: string
  onSaveApiKey: (key: string) => void
}

export default function SettingsMetadata({
  apiKey,
  onSaveApiKey
}: SettingsMetadataProps): React.JSX.Element {
  const [localKey, setLocalKey] = useState(apiKey)

  useEffect(() => {
    setLocalKey(apiKey)
  }, [apiKey])

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-orange-400">
        Metadata Provider
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <FaKey className="text-white/60" /> RAWG API Key
          </label>
          <a
            href="https://rawg.io/apidocs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
          >
            Get Key <FaExternalLinkAlt />
          </a>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="Paste your API key here..."
            className="flex-1 rounded bg-black/20 px-3 py-2 text-sm text-white border border-white/10 focus:border-orange-500 focus:outline-none"
          />
          <button
            onClick={() => onSaveApiKey(localKey)}
            className="flex items-center gap-2 rounded bg-white/10 px-4 text-sm font-bold text-white hover:bg-orange-500 hover:text-white transition-colors"
          >
            <FaSave /> Save
          </button>
        </div>
        <p className="mt-2 text-xs text-white/40">
          Used to auto-fetch game covers and descriptions.
        </p>
      </div>
    </div>
  )
}
