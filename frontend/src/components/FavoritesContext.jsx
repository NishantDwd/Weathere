import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (weather) => {
    // Prevent duplicates by city name (case-insensitive)
    if (favorites.some(fav => fav.name.toLowerCase() === weather.name.toLowerCase())) {
      throw new Error("Already in favorites");
    }
    setFavorites(prev => [...prev, weather]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, setFavorites, addFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}