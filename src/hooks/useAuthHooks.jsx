import useAuthStore from '../stores/authStore'; // Adjust the import path as necessary
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as authService from './authService'; // Adjust the import path as necessary

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.fetchRegisterUser,
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        queryClient.setQueryData(['auth', 'user'], data.user);
        queryClient.setQueryData(['auth', 'token'], data.accessToken);
      }
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.fetchLoginUser,
    onSuccess: (data) => {
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        queryClient.setQueryData(['auth', 'user'], data.user);
        queryClient.setQueryData(['auth', 'token'], data.accessToken);
      }
    },
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

