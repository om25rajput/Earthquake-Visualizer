import type { WeatherData } from "../types";

interface CurrentWeatherProps {
  weatherData: WeatherData;
  units: "metric" | "imperial";
}

function getIconColor(iconClass: string): string {
  if (iconClass.includes("fa-sun")) return "text-yellow-500";
  if (iconClass.includes("fa-moon")) return "text-indigo-400";
  if (iconClass.includes("fa-cloud-sun")) return "text-gray-400";
  if (iconClass.includes("fa-cloud-rain")) return "text-blue-500";
  if (iconClass.includes("fa-cloud")) return "text-gray-500";
  if (iconClass.includes("fa-bolt")) return "text-purple-500";
  if (iconClass.includes("fa-snowflake")) return "text-blue-300";
  return "text-gray-500";
}

function getUVColor(uvIndex: number): string {
  if (uvIndex <= 2) return "text-green-600";
  if (uvIndex <= 5) return "text-yellow-600";
  if (uvIndex <= 7) return "text-orange-600";
  if (uvIndex <= 10) return "text-red-600";
  return "text-purple-600";
}

export default function CurrentWeather({ weatherData, units }: CurrentWeatherProps) {
  const { current, location } = weatherData;
  
  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "km/h" : "mph";
  const pressureUnit = units === "metric" ? "hPa" : "inHg";
  const visibilityUnit = units === "metric" ? "km" : "mi";

  return (
    <div className="weather-card rounded-2xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            <i className="fas fa-map-marker-alt text-gray-500 mr-2"></i>
            {location.name || "Current Location"}{location.country ? `, ${location.country}` : ""}
          </h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString("en-US", { 
              weekday: "long", 
              hour: "numeric", 
              minute: "2-digit",
              hour12: true 
            })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-5xl md:text-6xl font-bold text-gray-800">
            {current.temperature}{tempUnit}
          </div>
          <div className="text-gray-600">
            Feels like {current.feelsLike}{tempUnit}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="weather-icon text-6xl mr-4">
            <i className={`${current.icon} ${getIconColor(current.icon)}`}></i>
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-800">
              {current.condition}
            </div>
            <div className="text-gray-600">
              {current.description}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <i className="fas fa-eye text-blue-600 mb-2 text-xl"></i>
          <div className="text-sm text-gray-600">Visibility</div>
          <div className="text-lg font-bold text-gray-800">
            {current.visibility} {visibilityUnit}
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <i className="fas fa-tint text-blue-600 mb-2 text-xl"></i>
          <div className="text-sm text-gray-600">Humidity</div>
          <div className="text-lg font-bold text-gray-800">
            {current.humidity}%
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <i className="fas fa-wind text-blue-600 mb-2 text-xl"></i>
          <div className="text-sm text-gray-600">Wind</div>
          <div className="text-lg font-bold text-gray-800">
            {current.windSpeed} {windUnit}
          </div>
          <div className="text-xs text-gray-500">
            {current.windDirection}
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <i className="fas fa-sun text-blue-600 mb-2 text-xl"></i>
          <div className="text-sm text-gray-600">UV Index</div>
          <div className="text-lg font-bold text-gray-800">
            {current.uvIndex}
          </div>
          <div className={`text-xs font-medium ${getUVColor(current.uvIndex)}`}>
            {current.uvLevel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <i className="fas fa-thermometer-half text-blue-600 mb-2 text-xl"></i>
          <div className="text-sm text-gray-600">Pressure</div>
          <div className="text-lg font-bold text-gray-800">
            {current.pressure} {pressureUnit}
          </div>
        </div>
        <div className="bg-white/50 rounded-xl p-4 text-center">
          <i className="fas fa-cloud-rain text-blue-600 mb-2 text-xl"></i>
          <div className="text-sm text-gray-600">Chance of Rain</div>
          <div className="text-lg font-bold text-gray-800">
            {current.rainChance}%
          </div>
        </div>
      </div>
    </div>
  );
}