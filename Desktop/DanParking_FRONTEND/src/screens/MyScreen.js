import React from 'react';
// import KakaoMapComponent from '../components/KakaoMapComponent'; // Removed
import { useFavorites } from '../context/FavoritesContext';

export default function MyScreen({ onLogout }) {
  const { addFavorite } = useFavorites(); // Keep addFavorite if it's used elsewhere in MyScreen, otherwise remove

  // Removed parkingLots and initialCenter

  return (
    <div className="p-4 h-full flex flex-col">
      <h1 className="text-xl font-bold mb-4">마이페이지</h1>
      <p className="mb-4">이곳에서 사용자 정보를 관리하거나 로그아웃할 수 있습니다.</p>
      {/* Removed KakaoMapComponent */}
      <button
        onClick={onLogout}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-md font-semibold hover:bg-red-600 mt-4"
      >
        로그아웃
      </button>
    </div>
  );
}
