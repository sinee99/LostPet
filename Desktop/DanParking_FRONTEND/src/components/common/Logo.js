import React from 'react';

export const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="rounded-xl flex items-center justify-center w-16 h-16 bg-white shadow-inner">
      <svg viewBox="0 0 64 64" className="w-12 h-12">
        <rect x="0" y="0" width="64" height="64" rx="8" fill="#0B61B8" />
        <g transform="translate(8,16) scale(0.9)" fill="#fff">
          <path d="M6 24c-1.1 0-2-.9-2-2v-7c0-1.6 1-3 2.5-3.5L13 8h22l8.5 3.5C46 13 47 14.4 47 16v7c0 1.1-.9 2-2 2H6z" />
          <circle cx="15" cy="23" r="3" />
          <circle cx="33" cy="23" r="3" />
        </g>
      </svg>
    </div>
    <div className="text-2xl font-bold text-white tracking-tight">DanPark</div>
  </div>
);