import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherData, searchCities as searchCitiesAPI } from "../lib/weatherApi";
import type { WeatherData, RecentCity, GeocodeResult } from "../types";
import { getLocalStorageItem, setLocalStorageItem } from "../lib/utils";

interface Location {
  latitude: number;
  longitude: number;
  name?: string;
  country?: string;
}

export function useWeather() {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [units, setUnits] = useState<"metric" | "imperial">(() => 
    getLocalStorageItem("weather-units", "metric")
  );
  const [recentCities, setRecentCities] = useState<RecentCity[]>(() =>
    getLocalStorageItem("recent-cities", [])
  );

  useEffect(() => {
    setLocalStorageItem("weather-units", units);
  }, [units]);

  useEffect(() => {
    setLocalStorageItem("recent-cities", recentCities);
  }, [recentCities]);

  const { data: weatherData, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["weather", currentLocation?.latitude, currentLocation?.longitude, units],
    queryFn: async () => {
      if (!currentLocation) throw new Error("No location set");
      
      const data = await fetchWeatherData(currentLocation.latitude, currentLocation.longitude, units);
      
      if (currentLocation.name && currentLocation.country) {
        data.location.name = currentLocation.name;
        data.location.country = currentLocation.country;
      }
      
      return data;
    },
    enabled: !!currentLocation,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const searchCities = useCallback(async (query: string): Promise<GeocodeResult[]> => {
    if (query.length < 2) return [];
    
    try {
      return await searchCitiesAPI(query);
    } catch (error) {
      console.error("City search error:", error);
      return [];
    }
  }, []);

  const addRecentCity = useCallback((city: { name: string; country: string; latitude: number; longitude: number }) => {
    const newCity: RecentCity = {
      id: Date.now().toString(),
      name: city.name,
      country: city.country,
      latitude: city.latitude,
      longitude: city.longitude,
      searchedAt: new Date(),
    };

    setRecentCities(prev => {
      const filtered = prev.filter(c => !(c.name === city.name && c.country === city.country));
      return [newCity, ...filtered].slice(0, 5);
    });
  }, []);

  const fetchWeatherByLocation = useCallback((latitude: number, longitude: number, cityName?: string, country?: string) => {
    setCurrentLocation({ latitude, longitude, name: cityName, country });
    
    if (cityName && country) {
      addRecentCity({ name: cityName, country, latitude, longitude });
    }
  }, [addRecentCity]);

  const toggleUnits = useCallback(() => {
    setUnits(prev => prev === "metric" ? "imperial" : "metric");
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude, "Current Location", "");
      },
      (error) => {
        console.error("Geolocation error:", error);
        // Fallback to San Francisco
        fetchWeatherByLocation(37.7749, -122.4194, "San Francisco", "United States");
      },
      { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
    );
  }, [fetchWeatherByLocation]);

  return {
    weatherData, isLoading, error, currentLocation, units, recentCities,
    searchCities, fetchWeatherByLocation, toggleUnits, getCurrentLocation,
  };
}