// project-exam-2-holidaze/src/stores/authStore.jsx

import { create } from 'zustand';
import { fetchRegisterUser, fetchLoginUser } from '../hooks/authService';

// Helper function to decode JWT token
const decodeToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  
  return JSON.parse(jsonPayload);
};

// Reusable function to set user session
const setUserSession = (set, data) => {
  set({ user: data, token: data.accessToken, error: null });
  localStorage.setItem('token', data.accessToken);
};

// Reusable function to clear user session
const clearUserSession = (set) => {
  set({ user: null, token: null, error: null });
  localStorage.removeItem('token');
};

// Main zustand store for authentication
const useAuthStore = create((set) => ({
  token: null,
  user: null,
  error: null,
  
  // Handles user registration
  registerUser: async (userData) => {
    try {
      const data = await fetchRegisterUser(userData);
      if (data.accessToken) {
        setUserSession(set, data);
        console.log("Access Token after registration:", data.accessToken);
      } else {
        set({ error: "Registration failed. Please check your input and try again." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      set({ error: error.message });
    }
  },

  // Handles user login
  loginUser: async (credentials) => {
    try {
      const data = await fetchLoginUser(credentials);
      if (data.accessToken) {
        setUserSession(set, data);
        const decodedToken = decodeToken(data.accessToken);
        console.log('Logged in user token data:', decodedToken);
      } else {
        set({ error: "Login failed. Please check your credentials and try again." });
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ error: error.message });
    }
  },

  // Handles user logout
  logoutUser: () => {
    clearUserSession(set);
    console.log("Logged out successfully");
  },
  
  // Sets whether the logged-in user is a venue manager
  setIsVenueManager: (isManager) => {
    set((state) => ({
      user: { ...state.user, venueManager: isManager }
    }));
    const updatedUser = { ...state.user, venueManager: isManager };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  },
}));

// Utility functions to check authentication and manager status
export const isAuthenticated = () => !!localStorage.getItem('token');
export const isVenueManager = () => {
  const user = useAuthStore.getState().user;
  return !!user?.venueManager;
};

export default useAuthStore;
export { decodeToken };
