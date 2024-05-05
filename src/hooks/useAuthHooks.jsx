
import useAuthStore from '../stores/authStore';
import BASE_URL from '../constants/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const updateAuthState = (data, queryClient) => {
  if (data.accessToken) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('user', JSON.stringify({
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      venueManager: data.venueManager,
    }));
    useAuthStore.setState({ 
      user: {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        venueManager: data.venueManager,
      }, 
      token: data.accessToken 
    });
    queryClient.setQueryData(['auth', 'user'], data);
    queryClient.setQueryData(['auth', 'token'], data.accessToken);
  }
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

      if (!response.ok) {
        const errorResponse = await response.json(); 
        if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
          throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
        } else {
          throw new Error('An unknown error occurred'); // Throw a generic error message
        }
      }

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
      if (!response.ok) {
        const errorResponse = await response.json(); 
        if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
          throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
        } else {
          throw new Error('An unknown error occurred'); // Throw a generic error message
        }
      }

      return response.json();
    },
    onSuccess: (data) => updateAuthState(data, queryClient),
  });
};

export const becomeVenueManager = async (token, name) => {
  const response = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: true }),
  });

  if (!response.ok) {
    const errorResponse = await response.json(); 
    if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
      throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
    } else {
      throw new Error('An unknown error occurred'); // Throw a generic error message
    }
  }

  return response.json();
};

export const revokeVenueManagerStatus = async (token, name) => {
  const response = await fetch(`${BASE_URL}/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ venueManager: false }),
  });

  if (!response.ok) {
    const errorResponse = await response.json(); 
    if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
      throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
    } else {
      throw new Error('An unknown error occurred'); // Throw a generic error message
    }
  }

  return response.json();
};

export const useUpdateProfileMedia = () => {
  const queryClient = useQueryClient();
  const { token, setUser } = useAuthStore((state) => ({
    token: state.token,
    setUser: state.setUser,
  }));

  return useMutation({
    mutationFn: async ({ avatar }) => {
      const user = useAuthStore.getState().user;
      const response = await fetch(`${BASE_URL}/profiles/${user.name}/media`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatar }),
      });
      if (!response.ok) {
        const errorResponse = await response.json(); 
        if (errorResponse && errorResponse.errors && errorResponse.errors.length > 0 && errorResponse.errors[0].message) {
          throw new Error(errorResponse.errors[0].message); // Throw error with message from API response
        } else {
          throw new Error('An unknown error occurred'); // Throw a generic error message
        }
      }

      return response.json();
    },
    onSuccess: (data) => {

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      queryClient.invalidateQueries(['profile']);
    },
  });
};


export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  return {
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      useAuthStore.setState({ user: null, token: null });
      queryClient.removeQueries(['auth', 'user']);
      queryClient.removeQueries(['auth', 'token']);
    }
  };
};

export const useBecomeVenueManager = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const token = useAuthStore((state) => state.token);

  return useMutation({
    mutationFn: async () => {
      const user = useAuthStore.getState().user;

      if (!user || !user.name) {
        throw new Error('User information not available.');
      }

      return becomeVenueManager(token, user.name); 
    },
    onSuccess: (updatedUser) => {
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      queryClient.setQueryData(['auth', 'user'], updatedUser);
    },
  });
};
  

export const useRevokeVenueManagerStatus = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const user = useAuthStore.getState().user;

      if (!user || !user.name) {
        throw new Error('User information not available.');
      }

      return revokeVenueManagerStatus(token, user.name); 
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data);
      setUser(data);
    },
  });
};