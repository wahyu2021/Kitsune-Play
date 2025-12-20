import { useEffect, useState, useCallback } from 'react'
import {
  WiDaySunny,
  WiNightClear,
  WiCloud,
  WiDayCloudy,
  WiNightAltCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiShowers
} from 'react-icons/wi'
import { getCurrentWeather, WeatherData, getWeatherDescription } from '@/services/weather'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface WeatherWidgetProps {
  lat: number
  lng: number
  city?: string
  variant?: 'small' | 'large'
}

export default function WeatherWidget({
  lat,
  lng,
  city,
  variant = 'small'
}: WeatherWidgetProps): React.JSX.Element | null {
  const { t } = useTranslation()
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const fetchWeather = useCallback(async (): Promise<void> => {
    if (!lat || !lng) return
    const data = await getCurrentWeather(lat, lng)
    setWeather(data)
  }, [lat, lng])

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 1800000) // 30 mins
    return () => clearInterval(interval)
  }, [fetchWeather])

  if (!weather) return null

  const getIcon = (code: number, isDay: boolean): React.ReactNode => {
    // WMO Code map
    // 0: Clear
    if (code === 0) return isDay ? <WiDaySunny /> : <WiNightClear />

    // 1-3: Cloudy
    if (code <= 3) return isDay ? <WiDayCloudy /> : <WiNightAltCloudy />

    // 45, 48: Fog
    if (code === 45 || code === 48) return <WiFog />

    // 51-67: Drizzle/Rain
    if (code >= 51 && code <= 67) return <WiRain />

    // 71-77: Snow
    if (code >= 71 && code <= 77) return <WiSnow />

    // 80-82: Showers
    if (code >= 80 && code <= 82) return <WiShowers />

    // 95-99: Thunder
    if (code >= 95) return <WiThunderstorm />

    return <WiCloud />
  }

  if (variant === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center gap-6 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl backdrop-saturate-150 shadow-2xl px-6 py-4"
      >
        {/* Text Info (Left) */}
        <div className="flex flex-col items-end text-right">
          {city && (
            <span className="text-xl font-bold tracking-wider text-white drop-shadow-sm">
              {city.toUpperCase()}
            </span>
          )}
          <span className="text-xs font-bold text-blue-200 tracking-widest opacity-80 mt-1 uppercase max-w-[120px] truncate">
            {t(getWeatherDescription(weather.weatherCode))}
          </span>
        </div>

        {/* Divider */}
        <div className="h-10 w-[1px] bg-white/20"></div>

        {/* Visual Stack (Right) - Icon & Temp */}
        <div className="flex flex-col items-center justify-center gap-1 min-w-[60px]">
          <div className="text-4xl text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]">
            {getIcon(weather.weatherCode, weather.isDay)}
          </div>
          <span className="text-2xl font-bold tracking-tighter text-white leading-none mt-1">
            {Math.round(weather.temperature)}°
          </span>
        </div>
      </motion.div>
    )
  }

  // Default 'small' variant (TopBar style)
  return (
    <div className="flex items-center gap-1 text-white pr-4 border-r border-white/20 mr-4 h-10">
      <div className="text-3xl flex items-center text-blue-300">
        {getIcon(weather.weatherCode, weather.isDay)}
      </div>
      <div className="flex flex-col items-center justify-center leading-none mt-1">
        <span className="text-xl font-medium tabular-nums">{Math.round(weather.temperature)}°</span>
        {city && (
          <span className="text-[9px] font-bold uppercase tracking-widest opacity-50 max-w-[60px] truncate">
            {city}
          </span>
        )}
      </div>
    </div>
  )
}