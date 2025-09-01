// Weather data types
export interface WeatherData {
  location: {
    name: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temperature: number;
    feelsLike: number;
    condition: string;
    description: string;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    pressure: number;
    uvIndex: number;
    uvLevel: string;
    rainChance: number;
    icon: string;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    condition: string;
    icon: string;
    precipitation: number;
  }>;
  daily: Array<{
    date: string;
    name: string;
    highTemp: number;
    lowTemp: number;
    condition: string;
    description: string;
    icon: string;
    precipitation: number;
  }>;
  sunMoon: {
    sunrise: string;
    sunset: string;
    moonPhase: string;
  };
  airQuality: {
    aqi: number;
    level: string;
    description: string;
    pm25: number;
    pm10: number;
    ozone: number;
  };
}

export interface GeocodeResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export interface RecentCity {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  searchedAt: Date;
}