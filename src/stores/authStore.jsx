// project-exam-2-holidaze/src/stores/authStore.jsx

import { create } from 'zustand';
import { fetchRegisterUser, fetchLoginUser } from '../hooks/authService';
import BASE_URL from '../constants/api';


const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  error: null,
  registerUser: async (userData) => {
    try {
      const data = await fetchRegisterUser(userData);
      if (data.accessToken) {
        set({ user: data, token: data.accessToken, error: null });
        localStorage.setItem('token', data.accessToken); // Persist token
        console.log("Access Token after registration:", data.accessToken); // Log the token
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
  logoutUser: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem('token');
    console.log("Logged out successfully");
  },

  
  setIsVenueManager: (isManager) => {
    set((state) => ({
        user: { ...state.user, venueManager: isManager },
    }));
},


becomeVenueManager: async ({ name }) => {
  const { token } = get();
  try {
    const response = await fetch(`${BASE_URL}/profiles/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ venueManager: true }),
    });

    if (!response.ok) {
      const error = `An error has occurred: ${response.status}`;
      throw new Error(error);
    }

    const updatedUser = await response.json();
    set({ user: { ...get().user, ...updatedUser } });
  } catch (error) {
    console.error("Error becoming venue manager:", error);
    set({ error: error.toString() });
  }
},


revokeVenueManagerStatus: async ({ name }) => {
  // Accessing the token using get()
  const token = get().token;
  try {
    const response = await fetch(`${BASE_URL}/profiles/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ venueManager: false }),
    });

    if (!response.ok) {
      throw new Error(`An error has occurred: ${response.status}`);
    }

    const updatedUser = await response.json();
    // Here we are directly using set() which is also provided by Zustand
    set({ user: updatedUser });
  } catch (error) {
    console.error("Error revoking venue manager status:", error);
    set({ error: error.toString() });
  }
},

  // Add more actions and state as needed

}));

export const isAuthenticated = () => !!localStorage.getItem('token');
export const isVenueManager = () => {
  const { user } = useAuthStore.getState();
  return !!user?.venueManager;
};

const decodeToken = (token) => {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  
  return JSON.parse(jsonPayload);
};

export default useAuthStore;
export { decodeToken };