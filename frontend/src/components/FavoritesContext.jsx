import { createContext, useContext, useState, useEffect } from "react";
import { fetchFavorites, removeFavorite as removeFavoriteApi } from "@/lib/favoriteApi";
import { fetchWeather } from "@/lib/weatherApi";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites when user logs in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchFavorites(token)
        .then(async (cities) => {
          // Fetch weather for each city
          const weatherData = await Promise.all(
            cities.map(async (city) => {
              try {
                const data = await fetchWeather(city);
                return { ...data.weather, forecast: data.forecast };
              } catch {
                return { name: city, error: true };
              }
            })
          );
          setFavorites(weatherData);
        })
        .catch(() => setFavorites([]));
    } else {
      setFavorites([]);
    }
  }, [localStorage.getItem("token")]);

  const addFavorite = async (weather) => {
    if (favorites.some(fav => fav.name.toLowerCase() === weather.name.toLowerCase())) {
      throw new Error("Already in favorites");
    }
    const token = localStorage.getItem("token");
    const res = await fetch("/api/favorites/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ city: weather.name }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to add favorite");
    }
    setFavorites(prev => [...prev, weather]);
  };

  // NEW: Remove favorite from backend and state
  const removeFavorite = async (city) => {
    const token = localStorage.getItem("token");
    await removeFavoriteApi(city, token);
    setFavorites(prev => prev.filter(fav => fav.name !== city));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}