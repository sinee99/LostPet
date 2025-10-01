import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import HomeScreen from './screens/HomeScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import MyScreen from './screens/MyScreen';
import LoginScreen from './screens/Login';
import SignupScreen from './screens/Signup';
import BottomNav from './components/common/BottomNav';
import { Logo } from './components/common/Logo';
import { FavoritesProvider } from './context/FavoritesContext';
// import TmapTestPage from './TmapTestPage'; // Removed TmapTestPage import

// Splash screen remains the same
function SplashScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B61B8]">
      <div className="flex flex-col items-center gap-6">
        <Logo />
        <div className="text-white opacity-90">편안한 단국대 주차 단주차</div>
      </div>
    </div>
  );
}

// Layout for the main app view with bottom navigation
function MainLayout() {
  return (
    <div className="h-screen relative">
      <main className="h-full overflow-y-auto pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate checking for a token
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1600);

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <div className="font-sans h-screen">
          {!isLoggedIn ? (
            <Routes>
              {/* Show login screen by default if not logged in */}
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="*" element={<LoginScreen onLoginSuccess={handleLoginSuccess} />} />
            </Routes>
          ) : (
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/favorites" element={<FavoritesScreen />} />
                <Route path="/my" element={<MyScreen onLogout={handleLogout} />} />
                {/* <Route path="/tmap" element={<TmapTestPage />} /> Removed TMap route */}
              </Route>
            </Routes>
          )}
        </div>
      </BrowserRouter>
    </FavoritesProvider>
  );
}