import { useEffect, useState } from 'react'
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
import { getCurrentWeather, WeatherData } from '@/services/weather'

interface WeatherWidgetProps {
  lat: number
  lng: number
  city?: string
}

export default function WeatherWidget({ lat, lng, city }: WeatherWidgetProps): React.JSX.Element | null {
  const [weather, setWeather] = useState<WeatherData | null>(null)

  const fetchWeather = async (): Promise<void> => {
    if (!lat || !lng) return
    const data = await getCurrentWeather(lat, lng)
    setWeather(data)
  }

  useEffect(() => {
    fetchWeather()
    const interval = setInterval(fetchWeather, 1800000) // 30 mins
    return () => clearInterval(interval)
  }, [lat, lng])

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

  return (
    <div className="flex items-center gap-1 text-white pr-4 border-r border-white/20 mr-4 h-10">
      <div className="text-3xl flex items-center text-blue-300">
        {getIcon(weather.weatherCode, weather.isDay)}
      </div>
      <div className="flex flex-col items-start justify-center leading-none mt-1">
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
