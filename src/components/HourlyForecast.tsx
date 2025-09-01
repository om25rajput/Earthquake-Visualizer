import type { WeatherData } from "../types";

interface HourlyForecastProps {
  hourlyData: WeatherData["hourly"];
  units: "metric" | "imperial";
}

function getIconColor(iconClass: string): string {
  if (iconClass.includes("fa-sun")) return "text-yellow-500";
  if (iconClass.includes("fa-moon")) return "text-indigo-400";
  if (iconClass.includes("fa-cloud-sun")) return "text-gray-400";
  if (iconClass.includes("fa-cloud-moon")) return "text-gray-400";
  if (iconClass.includes("fa-cloud-rain")) return "text-blue-500";
  if (iconClass.includes("fa-cloud")) return "text-gray-500";
  if (iconClass.includes("fa-bolt")) return "text-purple-500";
  if (iconClass.includes("fa-snowflake")) return "text-blue-300";
  return "text-gray-500";
}

export default function HourlyForecast({ hourlyData, units }: HourlyForecastProps) {
  const tempUnit = units === "metric" ? "°C" : "°F";

  return (
    <div className="weather-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-clock mr-2 text-blue-600"></i>
        24-Hour Forecast
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-2">
          {hourlyData.map((hour, index) => (
            <div key={index} className="forecast-card rounded-xl p-4 min-w-[120px] text-center">
              <div className="text-sm font-medium text-gray-600">
                {hour.time}
              </div>
              <div className="text-3xl my-3">
                <i className={`${hour.icon} ${getIconColor(hour.icon)}`}></i>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {hour.temperature}{tempUnit}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <i className="fas fa-droplet mr-1"></i>
                {hour.precipitation}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}