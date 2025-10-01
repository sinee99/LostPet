import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 검색 */}
      <div className="p-4 bg-white shadow flex items-center gap-2">
        <input type="text" placeholder="Search" className="flex-1 border rounded px-3 py-2" />
        <button className="px-3 py-2 bg-[#0B61B8] text-white rounded">검색</button>
      </div>

      {/* 지도 */}
      <div className="flex-1">
        <MapContainer center={[37.3219, 127.1266]} zoom={17} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[37.3219, 127.1266]}>
            <Popup>단국대 중앙도서관</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* 하단 메뉴 */}
      <div className="flex justify-around bg-white border-t py-2">
        <button className="flex flex-col items-center text-sm">🏠 홈</button>
        <button className="flex flex-col items-center text-sm">⭐ 즐겨찾기</button>
        <button className="flex flex-col items-center text-sm">👤 마이</button>
      </div>
    </div>
  );
}
