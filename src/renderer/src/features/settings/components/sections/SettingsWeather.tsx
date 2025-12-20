import { useState, useEffect } from 'react'
import { FaCloudSun, FaMapMarkerAlt } from 'react-icons/fa'
import { getCoordinates } from '@/services/weather'

interface SettingsWeatherProps {
  weatherCity: string
  onSaveWeatherCity: (city: string, lat: number, lng: number) => void
}

export default function SettingsWeather({
  weatherCity,
  onSaveWeatherCity
}: SettingsWeatherProps): React.JSX.Element {
  const [localCity, setLocalCity] = useState(weatherCity)
  const [isLocating, setIsLocating] = useState(false)
  const [cityError, setCityError] = useState<string | null>(null)

  useEffect(() => {
    setLocalCity(weatherCity)
  }, [weatherCity])

  const handleSaveCity = async (): Promise<void> => {
    if (!localCity.trim()) return

    setIsLocating(true)
    setCityError(null)
    try {
      const coords = await getCoordinates(localCity)
      if (coords) {
        onSaveWeatherCity(coords.name, coords.lat, coords.lng)
        setLocalCity(coords.name) // Update with formatted name
      } else {
        setCityError('City not found. Try a different name.')
      }
    } catch {
      setCityError('Error connecting to weather service.')
    } finally {
      setIsLocating(false)
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-cyan-400">
        Weather Widget
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <FaCloudSun className="text-white/60" /> Location
          </label>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={localCity}
            onChange={(e) => setLocalCity(e.target.value)}
            placeholder="Enter city (e.g. Tokyo)"
            className="flex-1 rounded bg-black/20 px-3 py-2 text-sm text-white border border-white/10 focus:border-cyan-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveCity()
            }}
          />
          <button
            onClick={handleSaveCity}
            disabled={isLocating}
            className="flex items-center gap-2 rounded bg-white/10 px-4 text-sm font-bold text-white hover:bg-cyan-500 hover:text-white transition-colors disabled:opacity-50"
          >
            {isLocating ? <span className="animate-spin">⟳</span> : <FaMapMarkerAlt />}
            Set
          </button>
        </div>
        {cityError && <p className="mt-2 text-xs text-red-400">{cityError}</p>}
        <p className="mt-2 text-xs text-white/40">Shows weather info in the Top Bar.</p>
      </div>
    </div>
  )
}
