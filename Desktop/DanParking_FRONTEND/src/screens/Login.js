import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaParking, FaEnvelope, FaLock } from 'react-icons/fa'; // react-icons 설치 필요: npm install react-icons

function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    // Basic validation
    if (!email) {
      setErrorMessage('이메일을 입력해주세요');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('유효한 이메일을 입력해주세요');
      return;
    }
    if (!password) {
      setErrorMessage('비밀번호를 입력해주세요');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      // Simulate API call - always succeed for now
      // In a real app, you would call your authentication API here
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

      // Call the onLoginSuccess prop passed from App.js
      // This will update the isLoggedIn state in App.js and trigger navigation to the main screen
      if (onLoginSuccess) {
        onLoginSuccess('dummy-auth-token'); // Pass a dummy token for now
      }
      // No need to navigate here, App.js will handle it based on isLoggedIn state
    } catch (error) {
      setErrorMessage('로그인 중 오류가 발생했습니다.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <FaParking className="text-blue-600 text-6xl mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">DanParking</h1>
          <p className="text-gray-600 text-center">단주차 서비스에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">이메일</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">비밀번호</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                로그인 중...
              </div>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="flex justify-center items-center text-sm">
          <span className="text-gray-600">계정이 없으신가요? </span>
          <Link to="/signup" className="text-blue-600 hover:underline ml-1">회원가입</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
