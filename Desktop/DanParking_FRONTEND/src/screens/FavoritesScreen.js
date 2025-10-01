import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigate } from 'react-router-dom';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const handleFavoriteClick = (location) => {
    navigate('/', { state: { center: location.position } });
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">즐겨찾기</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-500">즐겨찾기에 추가된 장소가 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {favorites.map(location => (
            <li 
              key={location.id} 
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50"
              onClick={() => handleFavoriteClick(location)}
            >
              <h2 className="font-semibold">{location.name}</h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
