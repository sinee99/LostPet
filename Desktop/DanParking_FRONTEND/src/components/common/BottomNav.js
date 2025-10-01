import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center w-full pt-2 pb-1 text-sm ` +
      (isActive ? 'text-blue-600' : 'text-gray-500')
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default function BottomNav() {
  const navItems = [
    {
      to: '/',
      label: '탐색',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      ),
    },
    {
      to: '/favorites',
      label: '즐겨찾기',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      ),
    },
    {
      to: '/my',
      label: '마이',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.59 6.05C20.22 5.38 19.58 5 18.86 5H5.14c-.72 0-1.36.38-1.73 1.05L2 12v6c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-6l-1.41-5.95z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-1px_4px_rgba(0,0,0,0.1)] flex justify-around z-50">
      {navItems.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
    </div>
  );
}
