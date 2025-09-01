import type { WeatherData } from "../types";

interface AdditionalInfoProps {
  sunMoon: WeatherData["sunMoon"];
  airQuality: WeatherData["airQuality"];
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "text-green-600";
  if (aqi <= 100) return "text-yellow-600";
  if (aqi <= 150) return "text-orange-600";
  if (aqi <= 200) return "text-red-600";
  if (aqi <= 300) return "text-purple-600";
  return "text-red-800";
}

export default function AdditionalInfo({ sunMoon, airQuality }: AdditionalInfoProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Sun & Moon */}
      <div className="weather-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-sun mr-2 text-yellow-500"></i>
          Sun & Moon
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-arrow-up text-yellow-500 mr-3 text-lg"></i>
              <span className="text-gray-600">Sunrise</span>
            </div>
            <span className="font-bold text-gray-800">
              {sunMoon.sunrise}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-arrow-down text-yellow-500 mr-3 text-lg"></i>
              <span className="text-gray-600">Sunset</span>
            </div>
            <span className="font-bold text-gray-800">
              {sunMoon.sunset}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <i className="fas fa-moon text-indigo-500 mr-3 text-lg"></i>
              <span className="text-gray-600">Moon Phase</span>
            </div>
            <span className="font-bold text-gray-800">
              {sunMoon.moonPhase}
            </span>
          </div>
        </div>
      </div>

      {/* Air Quality */}
      <div className="weather-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-leaf mr-2 text-green-500"></i>
          Air Quality
        </h3>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-green-600">
            {airQuality.aqi}
          </div>
          <div className={`text-lg font-medium ${getAQIColor(airQuality.aqi)}`}>
            {airQuality.level}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {airQuality.description}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">PM2.5</span>
            <span className="font-medium text-gray-800">
              {airQuality.pm25} μg/m³
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">PM10</span>
            <span className="font-medium text-gray-800">
              {airQuality.pm10} μg/m³
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ozone</span>
            <span className="font-medium text-gray-800">
              {airQuality.ozone} μg/m³
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}