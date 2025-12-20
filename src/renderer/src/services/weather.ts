/**
 * @fileoverview Weather API service using Open-Meteo.
 * Includes geocoding and caching for rate limit protection.
 * @module renderer/services/weather
 */

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
 * Fetches coordinates for a city name.
 * @param city - City name to geocode
 * @returns Location data or null if not found
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

let lastFetchTime = 0
let lastFetchData: WeatherData | null = null

/**
 * Fetches current weather for given coordinates.
 * Implements in-memory and localStorage caching.
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns Weather data or fallback values
 */
export async function getCurrentWeather(lat: number, lng: number): Promise<WeatherData | null> {
  if (Date.now() - lastFetchTime < 60000 && lastFetchData) {
    return lastFetchData
  }

  lastFetchTime = Date.now()

  const CACHE_KEY = `weather_data_${lat}_${lng}`
  const CACHE_DURATION = 30 * 60 * 1000

  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { timestamp, data } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_DURATION) {
        lastFetchData = data
        return data
      }
      // Keep old data as fallback
      lastFetchData = data
    }
  } catch (e) {
    console.warn('WeatherService: Cache read error', e)
  }

  try {
    const res = await fetch(
      `${WEATHER_API_URL}?latitude=${lat}&longitude=${lng}&current=temperature_2m,is_day,weather_code&timezone=auto`
    )

    if (res.status === 429) {
      console.warn('WeatherService: Rate limit exceeded. Using cache or mock.')
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const data = JSON.parse(cached).data
        lastFetchData = data
        return data
      }

      // Fallback Mock Data (Jakarta default)
      const mockData = {
        temperature: 30,
        weatherCode: 1, // Mainly Clear
        isDay: true
      }
      lastFetchData = mockData
      return mockData
    }

    if (!res.ok) throw new Error('Weather API error')

    const data = await res.json()
    if (data.current) {
      const weatherData = {
        temperature: data.current.temperature_2m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1
      }

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          data: weatherData
        })
      )

      lastFetchData = weatherData
      return weatherData
    }
    return null
  } catch (error) {
    console.error('WeatherService: Weather fetch failed', error)
    // Fallback to cache on error
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const data = JSON.parse(cached).data
      lastFetchData = data
      return data
    }

    if (lastFetchData) return lastFetchData

    return {
      temperature: 28,
      weatherCode: 3,
      isDay: true
    }
  }
}

/**
 * Converts WMO weather code to i18n translation key.
 * @param code - WMO weather code
 * @returns Translation key for weather description
 */
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'weather_desc.clear'
    case 1:
      return 'weather_desc.mainly_clear'
    case 2:
      return 'weather_desc.partly_cloudy'
    case 3:
      return 'weather_desc.overcast'
    case 45:
    case 48:
      return 'weather_desc.fog'
    case 51:
    case 53:
    case 55:
      return 'weather_desc.drizzle'
    case 56:
    case 57:
      return 'weather_desc.freezing_drizzle'
    case 61:
    case 63:
    case 65:
      return 'weather_desc.rain'
    case 66:
    case 67:
      return 'weather_desc.freezing_rain'
    case 71:
    case 73:
    case 75:
      return 'weather_desc.snow'
    case 77:
      return 'weather_desc.snow_grains'
    case 80:
    case 81:
    case 82:
      return 'weather_desc.showers'
    case 85:
    case 86:
      return 'weather_desc.snow_showers'
    case 95:
      return 'weather_desc.thunderstorm'
    case 96:
    case 99:
      return 'weather_desc.storm_hail'
    default:
      return 'weather_desc.unknown'
  }
}
