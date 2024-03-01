// project-exam-2-holidaze/src/stores/authStore.jsx

import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  // Initialize state from localStorage to maintain persistence across sessions
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null,

  // Actions for updating the state
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user)); // Persist user
    set({ user });
  },
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token); // Persist token
      set({ token });
    } else {
      localStorage.removeItem('token'); // Clear token from storage on logout
      localStorage.removeItem('user'); // Also clear user info
      set({ token: null, user: null });
    }
  },
  setError: (error) => set({ error }),

  // Utility actions
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