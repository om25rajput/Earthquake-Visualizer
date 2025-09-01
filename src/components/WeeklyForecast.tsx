import type { WeatherData } from "../types";

interface WeeklyForecastProps {
  dailyData: WeatherData["daily"];
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

export default function WeeklyForecast({ dailyData, units }: WeeklyForecastProps) {
  const tempUnit = units === "metric" ? "°C" : "°F";

  return (
    <div className="weather-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <i className="fas fa-calendar-alt mr-2 text-blue-600"></i>
        7-Day Forecast
      </h3>
      
      <div className="space-y-3">
        {dailyData.map((day, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
            <div className="flex items-center flex-1">
              <div className="text-lg font-medium text-gray-800 w-20">
                {day.name}
              </div>
              <div className="text-2xl mx-4">
                <i className={`${day.icon} ${getIconColor(day.icon)}`}></i>
              </div>
              <div className="flex-1">
                <div className="text-gray-800 font-medium">
                  {day.condition}
                </div>
                <div className="text-sm text-gray-500">
                  {day.description}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <i className="fas fa-droplet mr-1"></i>
                {day.precipitation}%
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-800">
                  {day.highTemp}{tempUnit}
                </div>
                <div className="text-sm text-gray-500">
                  {day.lowTemp}{tempUnit}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}