import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaCar } from 'react-icons/fa';
import { MdOutlineLock } from 'react-icons/md';

function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) return '이메일을 입력해주세요';
    if (!/\S+@\S+\.\S+/.test(email)) return '유효한 이메일을 입력해주세요';
    if (!password) return '비밀번호를 입력해주세요';
    if (password.length < 8) return '비밀번호는 최소 8자 이상이어야 합니다';
    if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다';
    if (!name) return '이름을 입력해주세요';
    if (name.length < 2) return '이름은 2자 이상이어야 합니다';
    if (!phoneNumber) return '전화번호를 입력해주세요';
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phoneNumber)) return '올바른 전화번호 형식이 아닙니다';
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      const response = await new Promise(resolve => setTimeout(() => {
        // In a real app, you'd send data to your backend
        console.log({ email, password, name, phoneNumber, carNumber });
        resolve({ success: true });
      }, 1500));

      if (response.success) {
        alert('회원가입 성공! 로그인해주세요.'); // Replace with a proper toast/snackbar
        navigate('/login'); // Navigate back to login
      } else {
        setErrorMessage(response.message || '회원가입 실패');
      }
    } catch (error) {
      setErrorMessage('회원가입 중 오류가 발생했습니다.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6 mt-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-gray-800">회원가입</h2>
        </div>

        <h1 className="text-3xl font-bold text-gray-800">계정 만들기</h1>
        <p className="text-gray-600">단주차 서비스를 이용하기 위해 정보를 입력해주세요</p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">이메일 *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일 *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="sr-only">비밀번호 *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호 * (최소 8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Confirmation */}
          <div>
            <label htmlFor="passwordConfirm" className="sr-only">비밀번호 확인 *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdOutlineLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="passwordConfirm"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호 확인 *"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="sr-only">이름 *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이름 *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="sr-only">전화번호 *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="text-gray-400" />
              </div>
              <input
                type="tel"
                id="phoneNumber"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="전화번호 * (예: 010-1234-5678)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Car Number (Optional) */}
          <div>
            <label htmlFor="carNumber" className="sr-only">차량번호 (선택)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCar className="text-gray-400" />
              </div>
              <input
                type="text"
                id="carNumber"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="차량번호 (선택) (예: 12가 3456)"
                value={carNumber}
                onChange={(e) => setCarNumber(e.target.value)}
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
                회원가입 중...
              </div>
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        <p className="text-gray-500 text-xs text-center mt-4">
          회원가입 시 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}

export default SignupScreen;
