import useAuthStore from '../stores/authStore'; // Importing authentication store
import BASE_URL from '../constants/api'; // Importing API base URL
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importing React Query hooks

// Function to update authentication state after successful login/register
const updateAuthState = (data, queryClient) => {
  if (data.accessToken) {
    // Store token and user data in local storage
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      venueManager: data.venueManager,
    }));

    // Update authentication state using the auth store
    useAuthStore.setState({ 
      user: {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        venueManager: data.venueManager,
      }, 
      token: data.accessToken 
    });

    // Update data in the React Query cache
    queryClient.setQueryData(['auth', 'user'], data);
    queryClient.setQueryData(['auth', 'token'], data.accessToken);
  }
};

// Hook for user registration
export const useRegisterUser = () => {
  const queryClient = useQueryClient(); // Initialize QueryClient

  return useMutation({
    mutationFn: async (userData) => {
      // Perform API request to register user
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      // Handle errors from API response
      if (!response.ok) {
        const errorResponse = await response.json(); 
        if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
          throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
        } else {
          throw new Error('An unknown error occurred'); // Throw a generic error message
        }
      }

      return response.json(); // Return response data
    },
    onSuccess: (data) => updateAuthState(data, queryClient), // Update auth state after success
  });
};

// Hook for user login
export const useLoginUser = () => {
  const queryClient = useQueryClient(); // Initialize QueryClient

  return useMutation({
    mutationFn: async (credentials) => {
      // Perform API request to login user
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      // Handle errors from API response
      if (!response.ok) {
        const errorResponse = await response.json(); 
        if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
          throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
        } else {
          throw new Error('An unknown error occurred'); // Throw a generic error message
        }
      }

      return response.json(); // Return response data
    },
    onSuccess: (data) => updateAuthState(data, queryClient), // Update auth state after success
  });
};

// Function to make user a venue manager
export const becomeVenueManager = async (token, name) => {
  // Perform API request to update user profile
  const response = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: true }), // Set venue manager status
  });

  // Handle errors from API response
  if (!response.ok) {
    const errorResponse = await response.json(); 
    if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
      throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
    } else {
      throw new Error('An unknown error occurred'); // Throw a generic error message
    }
  }

  return response.json(); // Return response data
};

// Function to revoke venue manager status
export const revokeVenueManagerStatus = async (token, name) => {
  // Perform API request to update user profile
  const response = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: false }), // Revoke venue manager status
  });

  // Handle errors from API response
  if (!response.ok) {
    const errorResponse = await response.json(); 
    if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
      throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
    } else {
      throw new Error('An unknown error occurred'); // Throw a generic error message
    }
  }

  return response.json(); // Return response data
};

// Hook for updating user profile media
export const useUpdateProfileMedia = () => {
  const queryClient = useQueryClient(); // Initialize QueryClient
  const { token, setUser } = useAuthStore((state) => ({
    token: state.token,
    setUser: state.setUser,
  }));

  return useMutation({
    mutationFn: async ({ avatar }) => {
      // Retrieve user data from auth store
      const user = useAuthStore.getState().user;
      // Perform API request to update user profile media
      const response = await fetch(`${BASE_URL}/profiles/${user.name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar }),
      });

      // Handle errors from API response
      if (!response.ok) {
        const errorResponse = await response.json(); 
        if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
          throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
        } else {
          throw new Error('An unknown error occurred'); // Throw a generic error message
        }
      }

      return response.json(); // Return response data
    },
    onSuccess: (data) => {
      // Update local storage and cache after success
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      queryClient.invalidateQueries(['profile']);
    },
  });
};

// Hook for user logout 
export const useLogoutUser = () => {
  const queryClient = useQueryClient(); // Initialize QueryClient

  const logout = () => {
    // Clear token and user data from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear user data from auth store
    useAuthStore.setState({ user: null, token: null });
    // Remove cached data related to authentication
    queryClient.removeQueries(['auth', 'user']);
    queryClient.removeQueries(['auth', 'token']);
  };

  return { logout };
};

// Hook for user becoming a venue manager
export const useBecomeVenueManager = () => {
  const queryClient = useQueryClient(); // Initialize QueryClient
  const setUser = useAuthStore((state) => state.setUser); // Get setUser function from auth store
  const token = useAuthStore((state) => state.token); // Get token from auth store
  
  return useMutation({
    mutationFn: async () => {
      const user = useAuthStore.getState().user; // Get user data from auth store
      if (!user || !user.name) {
        throw new Error('User information not available.'); // Throw error if user data is not available
      }

      return becomeVenueManager(token, user.name); // Call function to make user a venue manager
    },
    onSuccess: (updatedUser) => {
      // Update user data in local storage, auth store, and cache after success
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      queryClient.setQueryData(['auth', 'user'], updatedUser);
    },
  });
};

// Hook for revoking venue manager status
export const useRevokeVenueManagerStatus = () => {
  const queryClient = useQueryClient(); // Initialize QueryClient
  const setUser = useAuthStore((state) => state.setUser); // Get setUser function from auth store
  
  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token'); // Get token from local storage
      const user = useAuthStore.getState().user; // Get user data from auth store
      if (!user || !user.name) {
        throw new Error('User information not available.'); // Throw error if user data is not available
      }

      return revokeVenueManagerStatus(token, user.name); // Call function to revoke venue manager status
    },
    onSuccess: (data) => {
      // Update user data in cache and auth store after success
      queryClient.setQueryData(['auth', 'user'], data);
      setUser(data);
    },
  });
};