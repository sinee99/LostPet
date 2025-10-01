import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { useLocation } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import KakaoMapComponent from '../components/KakaoMapComponent';

// Modified SearchBar to accept props
const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 z-[1000]">
    <div className="bg-white rounded-full shadow-lg flex items-center p-2">
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-transparent focus:outline-none pl-4"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button className="p-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  </div>
);

export default function HomeScreen() {
  const { addFavorite } = useFavorites();
  const location = useLocation();

  const allParkingLots = [ // Renamed to allParkingLots
    {
      id: 'lot_outdoor',
      name: '야외주차장',
      position: [37.32329, 127.12720],
      occupied: 70,
      total: 108
    },
    {
      id: 'lot_software_ict',
      name: '소프트웨어 ICT 주차장',
      position: [37.32286, 127.12689],
      occupied: 45,
      total: 50
    },
    {
      id: 'lot_glocal',
      name: '글로컬 주차장',
      position: [37.32172, 127.12415],
      occupied: 100,
      total: 150
    },
    {
      id: 'lot_parking_building_new',
      name: '주차빌딩',
      position: [37.32031, 127.12500],
      occupied: 250,
      total: 300
    },
    {
      id: 'lot_experiment',
      name: '실험동 주차장',
      position: [37.31974, 127.12523],
      occupied: 15,
      total: 30
    },
    {
      id: 'lot_museum',
      name: '박물관 주차장',
      position: [37.31933, 127.12839],
      occupied: 35,
      total: 40
    },
    {
      id: 'lot_dormitory',
      name: '기숙사 주차장',
      position: [37.31720, 127.12725],
      occupied: 20,
      total: 30
    },
    {
      id: 'lot_gymnasium_new',
      name: '체육관 주차장',
      position: [37.31941, 127.13185],
      occupied: 90,
      total: 100
    },
    {
      id: 'lot_law',
      name: '법학관 주차장',
      position: [37.32138, 127.12992],
      occupied: 15,
      total: 50
    },
    {
      id: 'lot_insangsa',
      name: '인상사 주차장',
      position: [37.32201, 127.12849],
      occupied: 100,
      total: 120
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredParkingLots, setFilteredParkingLots] = useState(allParkingLots);

  useEffect(() => {
    const results = allParkingLots.filter(lot =>
      lot.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParkingLots(results);
  }, [searchTerm]); // Re-filter when searchTerm changes

  const initialCenter = [37.3218, 127.1265];
  const newCenter = location.state?.center;

  return (
    <div className="relative h-full">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <KakaoMapComponent
        parkingLots={filteredParkingLots} // Pass filtered parking lots
        initialCenter={initialCenter}
        newCenter={newCenter}
        addFavorite={addFavorite}
      />
    </div>
  );
}