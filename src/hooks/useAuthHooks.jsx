// project-exam-2-hollidaze/src/hooks/useAuthHooks.jsx

import useAuthStore from '../stores/authStore'; // Adjust the import path as necessary
import BASE_URL from '../constants/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateAuthState = (data, queryClient) => {
  if (data.accessToken) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    useAuthStore.setState({ user: data.user, token: data.accessToken });
    queryClient.setQueryData(['auth', 'user'], data.user);
    queryClient.setQueryData(['auth', 'token'], data.accessToken);
  }
};

const handleLoginSuccess = (response) => {
  const { accessToken, ...userData } = response;
  useAuthStore.getState().setToken(accessToken);
  useAuthStore.getState().setUser(userData);
  console.log("Logged in user data:", userData);
};


export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to register');
      return response.json();
    },
    onSuccess: (data) => updateAuthState(data, queryClient),
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Failed to login');
      return response.json();
    },
    onSuccess: (data) => updateAuthState(data, queryClient),
  });
};

export const becomeVenueManager = async (token) => {
  const response = await fetch(`${BASE_URL}/profiles/becomeVenueManager`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: true }),
  });
  if (!response.ok) throw new Error('Failed to become venue manager');
  return await response.json();
};
  
  // Function to revoke venue manager status
  export const revokeVenueManagerStatus = async (token) => {
    const response = await fetch(`${BASE_URL}/profiles/revokeVenueManagerStatus`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ venueManager: false }),
    });
    if (!response.ok) throw new Error('Failed to revoke venue manager status');
    return response.json();
  };

// hooks

  export const useLogoutUser = () => {
    const queryClient = useQueryClient();
    return {
      logout: () => {
        localStorage.removeItem('token');
        queryClient.setQueryData(['auth', 'user'], null);
        queryClient.setQueryData(['auth', 'token'], null);
        // Optionally, clear all queries from the cache
        queryClient.clear();
      }
    };
  };
  
  export const useBecomeVenueManager = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore(state => state.setUser);
    const token = useAuthStore(state => state.token);
  
    return useMutation({
      mutationFn: async () => {
        const response = await fetch(`${BASE_URL}/profiles/${user.name}`, { // Ensure you replace `user.name` with the actual username from your state
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ venueManager: true }),
        });
        if (!response.ok) {
          // Handle error, possibly by throwing an exception
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to become venue manager');
        }
        return await response.json(); // This should include the updated user data
      },
      onSuccess: (updatedUser) => {
        // Update local storage and Zustand store with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        // Optionally, update React Query cache if you're caching user data there
        queryClient.setQueryData(['auth', 'user'], updatedUser);
      },
    });
  };
  
  export const useRevokeVenueManagerStatus = () => {
    const queryClient = useQueryClient();
    const setUser = useAuthStore(state => state.setUser); // Assuming this action exists
    
    return useMutation({
      mutationFn: async () => {
        const token = localStorage.getItem('token');
        return authService.revokeVenueManagerStatus(token);
      },
      onSuccess: (data) => {
        // Assuming the API returns updated user data
        queryClient.setQueryData(['auth', 'user'], data);
        setUser(data); // Update Zustand store with the new user data
      },
    });
  };

