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
let lastFetchTime = 0
let lastFetchData: WeatherData | null = null

export async function getCurrentWeather(lat: number, lng: number): Promise<WeatherData | null> {
  // 0. In-Memory Debounce (1 minute)
  // If we fetched recently (success or fail), don't spam.
  if (Date.now() - lastFetchTime < 60000 && lastFetchData) {
    return lastFetchData
  }

  lastFetchTime = Date.now()

  const CACHE_KEY = `weather_data_${lat}_${lng}`
  const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

  // 1. Try LocalStorage Cache
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

  // 2. Fetch API
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

      // 3. Save Cache
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

    // If we have in-memory data from previous run, return it
    if (lastFetchData) return lastFetchData

    // Final fallback if everything fails
    return {
      temperature: 28,
      weatherCode: 3,
      isDay: true
    }
  }
}

/**
 * Get icon name/class based on WMO Weather Code
 * https://open-meteo.com/en/docs
 */
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear'
    case 1:
      return 'Mainly Clear'
    case 2:
      return 'Partly Cloudy'
    case 3:
      return 'Overcast'
    case 45:
    case 48:
      return 'Fog'
    case 51:
    case 53:
    case 55:
      return 'Drizzle'
    case 56:
    case 57:
      return 'Freezing Drizzle'
    case 61:
    case 63:
    case 65:
      return 'Rain'
    case 66:
    case 67:
      return 'Freezing Rain'
    case 71:
    case 73:
    case 75:
      return 'Snow'
    case 77:
      return 'Snow Grains'
    case 80:
    case 81:
    case 82:
      return 'Showers'
    case 85:
    case 86:
      return 'Snow Showers'
    case 95:
      return 'Thunderstorm'
    case 96:
    case 99:
      return 'Storm & Hail'
    default:
      return 'Unknown'
  }
}
