import { create } from 'zustand';
import { fetchRegisterUser, fetchLoginUser } from '../hooks/authService';

const useAuthStore = create((set) => ({
  token: null,
  user: null,
  error: null,
  registerUser: async (userData) => {
    try {
      const data = await fetchRegisterUser(userData);
      if (data.accessToken) {
        set({ user: data, token: data.accessToken, error: null });
        localStorage.setItem('token', data.accessToken); // Persist token
        logAuthStatus(); // Newly added for logging upon registration
      } else {
        set({ error: "Registration failed. Please check your input and try again." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      set({ error: error.message });
    }
  },
  loginUser: async (credentials) => {
    try {
      const data = await fetchLoginUser(credentials);
      if (data.accessToken) {
        set({ user: data, token: data.accessToken, error: null });
        localStorage.setItem('token', data.accessToken); // Persist token
        logAuthStatus(); // Newly added for logging upon login
      } else {
        set({ error: "Login failed. Please check your credentials and try again." });
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ error: error.message });
    }
  },
}));

export const isAuthenticated = () => !!localStorage.getItem('token');
export const isVenueManager = () => {
  const { user } = useAuthStore.getState();
  return !!user?.venueManager;
};

// Function to decode JWT (simplified version for logging purposes)
const decodeToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
};

// Updated logAuthStatus function to include token and its decoded data
export const logAuthStatus = () => {
  const token = localStorage.getItem('token');
  console.log(`Access Token: ${token}`);
  
  // Decode and log the data within the token
  const decodedData = decodeToken(token);
  console.log('Decoded Token Data:', decodedData);
;

  // Logging user roles based on decoded data (if applicable)
  console.log(`Logged in: ${isAuthenticated()}`);
  console.log(`Venue Manager: ${isVenueManager()}`);
};

export default useAuthStore;