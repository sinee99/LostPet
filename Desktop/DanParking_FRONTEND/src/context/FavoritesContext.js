import React, { createContext, useState, useContext } from 'react';

const FavoritesContext = createContext();

export function useFavorites() {
  return useContext(FavoritesContext);
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (location) => {
    // Prevent adding duplicates
    if (!favorites.find(fav => fav.id === location.id)) {
      setFavorites(prevFavorites => [...prevFavorites, location]);
      alert('즐겨찾기에 추가되었습니다.');
    }
    else {
        alert('이미 즐겨찾기에 추가된 장소입니다.');
    }
  };

  const value = {
    favorites,
    addFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
