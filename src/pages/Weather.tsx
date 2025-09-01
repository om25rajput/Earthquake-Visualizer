import { useEffect } from "react";
import { useWeather } from "../hooks/useWeather";
import WeatherSearch from "../components/WeatherSearch";
import CurrentWeather from "../components/CurrentWeather";
import HourlyForecast from "../components/HourlyForecast";
import WeeklyForecast from "../components/WeeklyForecast";
import AdditionalInfo from "../components/AdditionalInfo";

export default function Weather() {
  const { 
    weatherData, 
    isLoading, 
    error, 
    fetchWeatherByLocation, 
    currentLocation,
    units 
  } = useWeather();

  useEffect(() => {
    let mounted = true;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            const { latitude, longitude } = position.coords;
            fetchWeatherByLocation(latitude, longitude, "Current Location", "");
          }
        },
        (error) => {
          if (mounted) {
            console.error("Geolocation error:", error);
            fetchWeatherByLocation(37.7749, -122.4194, "San Francisco", "United States");
          }
        },
        { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
      );
    } else {
      fetchWeatherByLocation(37.7749, -122.4194, "San Francisco", "United States");
    }
    
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600">
      <title>Weather Now - Current Weather and Forecasts</title>
      
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">
              <i className="fas fa-cloud-sun mr-2"></i>Weather Now
            </h1>
          </div>
          <WeatherSearch />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="weather-card rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </div>
        ) : error ? (
          <div className="weather-card rounded-2xl p-8 text-center">
            <div className="text-6xl text-gray-400 mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to load weather data</h3>
            <p className="text-gray-600 mb-6">Please check your internet connection and try again.</p>
          </div>
        ) : weatherData ? (
          <>
            <CurrentWeather weatherData={weatherData} units={units} />
            <HourlyForecast hourlyData={weatherData.hourly} units={units} />
            <WeeklyForecast dailyData={weatherData.daily} units={units} />
            <AdditionalInfo 
              sunMoon={weatherData.sunMoon} 
              airQuality={weatherData.airQuality} 
            />
          </>
        ) : null}
      </main>

      <footer className="mt-12 text-center py-6 text-white/80">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm">
            Weather data provided by{" "}
            <a 
              href="https://open-meteo.com/" 
              className="text-white hover:text-yellow-300 underline" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Open-Meteo API
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}