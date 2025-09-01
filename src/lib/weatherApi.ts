import type { WeatherData, GeocodeResult } from '../types';

// Weather condition mapping for Open-Meteo weather codes
function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: "Clear", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Foggy", 51: "Light Drizzle", 53: "Moderate Drizzle",
    55: "Heavy Drizzle", 61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    71: "Light Snow", 73: "Moderate Snow", 75: "Heavy Snow",
    80: "Light Showers", 81: "Moderate Showers", 82: "Heavy Showers",
    95: "Thunderstorm", 96: "Thunderstorm with Hail", 99: "Thunderstorm with Hail",
  };
  return conditions[code] || "Unknown";
}

function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: "Clear skies throughout the day", 1: "Mainly clear with few clouds",
    2: "Mix of sun and clouds", 3: "Overcast skies", 45: "Reduced visibility due to fog",
    51: "Light drizzle intermittent", 61: "Light rain showers", 63: "Moderate rain",
    95: "Thunderstorm activity",
  };
  return descriptions[code] || "Weather conditions vary";
}

function getWeatherIcon(code: number, isDay: boolean): string {
  const iconMap: Record<number, { day: string; night: string }> = {
    0: { day: "fas fa-sun", night: "fas fa-moon" },
    2: { day: "fas fa-cloud-sun", night: "fas fa-cloud-moon" },
    3: { day: "fas fa-cloud", night: "fas fa-cloud" },
    61: { day: "fas fa-cloud-rain", night: "fas fa-cloud-rain" },
    95: { day: "fas fa-bolt", night: "fas fa-bolt" },
  };
  const iconSet = iconMap[code] || { day: "fas fa-sun", night: "fas fa-moon" };
  return isDay ? iconSet.day : iconSet.night;
}

function getWindDirection(degrees: number): string {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function formatHourlyTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function getDayName(index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  const date = new Date();
  date.setDate(date.getDate() + index);
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export async function fetchWeatherData(
  latitude: number, 
  longitude: number, 
  units: "metric" | "imperial" = "metric"
): Promise<WeatherData> {
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.searchParams.set("latitude", latitude.toString());
  weatherUrl.searchParams.set("longitude", longitude.toString());
  weatherUrl.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m");
  weatherUrl.searchParams.set("hourly", "temperature_2m,precipitation_probability,weather_code");
  weatherUrl.searchParams.set("daily", "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max");
  weatherUrl.searchParams.set("timezone", "auto");
  weatherUrl.searchParams.set("forecast_days", "7");

  const response = await fetch(weatherUrl.toString());
  if (!response.ok) throw new Error(`Weather API error: ${response.status}`);

  const data = await response.json();
  if (!data || !data.current) throw new Error("Invalid weather data received");

  return {
    location: { name: "Current Location", country: "", latitude, longitude },
    current: {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      condition: getWeatherCondition(data.current.weather_code),
      description: getWeatherDescription(data.current.weather_code),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m * (units === "imperial" ? 2.237 : 1)),
      windDirection: getWindDirection(data.current.wind_direction_10m),
      visibility: 10, pressure: Math.round(data.current.pressure_msl),
      uvIndex: 6, uvLevel: "Moderate",
      rainChance: data.hourly.precipitation_probability[0] || 0,
      icon: getWeatherIcon(data.current.weather_code, data.current.is_day),
    },
    hourly: data.hourly.temperature_2m.slice(0, 24).map((temp: number, index: number) => ({
      time: formatHourlyTime(data.hourly.time[index]),
      temperature: Math.round(temp),
      condition: getWeatherCondition(data.hourly.weather_code[index]),
      icon: getWeatherIcon(data.hourly.weather_code[index], index < 12),
      precipitation: data.hourly.precipitation_probability[index] || 0,
    })),
    daily: data.daily.temperature_2m_max.map((maxTemp: number, index: number) => ({
      date: data.daily.time[index], name: getDayName(index),
      highTemp: Math.round(maxTemp), lowTemp: Math.round(data.daily.temperature_2m_min[index]),
      condition: getWeatherCondition(data.daily.weather_code[index]),
      description: getWeatherDescription(data.daily.weather_code[index]),
      icon: getWeatherIcon(data.daily.weather_code[index], true),
      precipitation: data.daily.precipitation_probability_max[index] || 0,
    })),
    sunMoon: {
      sunrise: formatTime(data.daily.sunrise[0]),
      sunset: formatTime(data.daily.sunset[0]),
      moonPhase: "Waxing Crescent",
    },
    airQuality: { aqi: 42, level: "Good", description: "Air quality is satisfactory", pm25: 8, pm10: 15, ozone: 62 },
  };
}

export async function searchCities(query: string): Promise<GeocodeResult[]> {
  if (query.length < 2) return [];
  
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  
  if (!response.ok) throw new Error(`Search error: ${response.status}`);
  
  const data = await response.json();
  const results = data.results || [];
  
  return results.map((result: any) => ({
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  })).filter((result: any) => result.name && result.country);
}