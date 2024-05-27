import { create } from 'zustand';

// Define a custom hook to manage authentication state using Zustand
const useAuthStore = create((set) => ({
  // Initialize state for token and user, retrieving values from localStorage if available
  token: localStorage.getItem('token') || null,
  user: (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null; 
    }
  })(),

  // Setter function to update user state and store user data in localStorage
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  // Setter function to update token state and store token in localStorage
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      set({ token });
    } else {
      // If token is null, remove both token and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null });
    }
  },

  // Setter function to handle error state
  setError: (error) => set({ error }),

  // Setter function to log out user by removing token and user data from localStorage and resetting state
  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));

// Selector function to check if user is authenticated based on token existence
export const isAuthenticated = () => {
  const { token } = useAuthStore.getState();
  return !!token;
};

// Selector function to check if user is a venue manager based on user data
export const isVenueManager = () => {
  const { user } = useAuthStore.getState();
  return !!user?.venueManager;
};

export default useAuthStore;
