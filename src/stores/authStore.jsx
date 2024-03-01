// project-exam-2-holidaze/src/stores/authStore.jsx

import { create } from 'zustand';

const useAuthStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  // Use a try-catch block to safely attempt to parse the 'user' item
  user: (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
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