// project-exam-2-holidaze/src/hooks/authService.jsx

import BASE_URL from '../constants/api';


export const fetchRegisterUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to register');
  return response.json();
};

export const fetchLoginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
};

