export interface WeatherData {
  temperature: number
  weatherCode: number
  isDay: boolean
}

export interface GeoLocation {
  lat: number
  lng: number
  name: string
  country?: string
}

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast'
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search'

/**
 * Fetch coordinates for a given city name.
 */
export async function getCoordinates(city: string): Promise<GeoLocation | null> {
  try {
    const res = await fetch(
      `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    )
    if (!res.ok) throw new Error('Geocoding API error')
    
    const data = await res.json()
    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return {
        lat: result.latitude,
        lng: result.longitude,
        name: result.name,
        country: result.country
      }
    }
    return null
  } catch (error) {
    console.error('WeatherService: Geocoding failed', error)
    return null
  }
}

/**
 * Fetch current weather for specific coordinates.
 */
export async function getCurrentWeather(lat: number, lng: number): Promise<WeatherData | null> {
  try {
    const res = await fetch(
      `${WEATHER_API_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,is_day,weather_code&timezone=auto`
    )
    if (!res.ok) throw new Error('Weather API error')

    const data = await res.json()
    if (data.current) {
      return {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1
      }
    }
    return null
  } catch (error) {
    console.error('WeatherService: Weather fetch failed', error)
    return null
  }
}

/**
 * Get icon name/class based on WMO Weather Code
 * https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0: return 'Clear sky'
    case 1:
    case 2:
    case 3: return 'Mainly clear, partly cloudy, and overcast'
    case 45:
    case 48: return 'Fog'
    case 51:
    case 53:
    case 55: return 'Drizzle'
    case 61:
    case 63:
    case 65: return 'Rain'
    case 71:
    case 73:
    case 75: return 'Snow'
    case 95:
    case 96:
    case 99: return 'Thunderstorm'
    default: return 'Unknown'
  }
}
