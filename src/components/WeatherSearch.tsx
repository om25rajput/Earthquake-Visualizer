import { useState, useRef, useEffect } from "react";
import { useWeather } from "../hooks/useWeather";
import type { GeocodeResult } from "../types";

export default function WeatherSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchCities, fetchWeatherByLocation, recentCities, units, toggleUnits, getCurrentLocation } = useWeather();

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await searchCities(searchQuery);
          setSearchResults(results);
          setShowDropdown(true);
        } catch (error) {
          console.error("Search error:", error);
          setSearchResults([]);
        }
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchCities]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city: GeocodeResult) => {
    fetchWeatherByLocation(city.latitude, city.longitude, city.name, city.country);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleRecentCitySelect = (city: any) => {
    fetchWeatherByLocation(city.latitude, city.longitude, city.name, city.country);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 mr-4">
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 pr-4 rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none text-lg"
              />
              <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                </div>
              )}
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl search-dropdown max-h-60 overflow-y-auto z-50">
                {searchResults.map((city, index) => (
                  <div
                    key={`${city.latitude}-${city.longitude}`}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleCitySelect(city)}
                  >
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt text-gray-400 mr-3"></i>
                      <div>
                        <div className="font-medium text-gray-800">
                          {city.name}{city.admin1 ? `, ${city.admin1}` : ""}
                        </div>
                        <div className="text-sm text-gray-500">{city.country}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleUnits}
            className="px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            °{units === "metric" ? "C" : "F"}
          </button>
          <button
            onClick={getCurrentLocation}
            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <i className="fas fa-location-arrow"></i>
          </button>
        </div>
      </div>

      {recentCities && recentCities.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {recentCities.map((city) => (
              <button
                key={city.id}
                onClick={() => handleRecentCitySelect(city)}
                className="recent-city-tag px-3 py-1 bg-white/20 text-white rounded-full text-sm hover:bg-white/30 transition-all"
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}