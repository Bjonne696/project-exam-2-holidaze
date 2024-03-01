// project-exam-2-holidaze/src/stores/authStore.jsx

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null; // Ensure null is returned if user is undefined
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null; // Return null in case of any error
    }
  })(),

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      set({ token });
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null });
    }
  },
  setError: (error) => set({ error }),
  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));




// Utility functions
export const isAuthenticated = () => {
  const { token } = useAuthStore.getState();
  return !!token;
};

export const isVenueManager = () => {
  const { user } = useAuthStore.getState();
  return !!user?.venueManager;
};

export default useAuthStore;