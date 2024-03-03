
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore'; 

const fetchVenuesBatch = async (offset, limit = 100) => {
  try {
    const token = useAuthStore.getState().token; 
    const response = await fetch(`${BASE_URL}/venues?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch venues:", error);
    throw error; 
  }
};


const useCreateVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (venueData) => {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${BASE_URL}/venues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(venueData),
      });
      if (!response.ok) throw new Error('Failed to create venue');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['venues']);
    },
    onError: (error) => {

      console.error("Error creating venue:", error.response ? error.response.data : error);

    },
  });
};





const useFetchVenueById = (venueId) => {

  const url = `${BASE_URL}/venues/${venueId}?_bookings=true`;

  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch venue with bookings');
      return response.json();
    },
    enabled: !!venueId, 
  });
};

const useFetchManagedVenues = (name, token) => {
  return useQuery({
    queryKey: ['managedVenues', name],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/profiles/${name}/venues`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch managed venues');
      }

      return response.json();
    },
    enabled: !!name && !!token, 
  });
};
  
 
  const useUpdateVenue = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async ({ venueId, formData }) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to update venue');
        }
  
        return response.json();
      },
      onSuccess: () => {

        queryClient.invalidateQueries('venues'); 
      },
    });
  };
  

   const useDeleteVenue = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (venueId) => {
        const token = localStorage.getItem('token'); 
        const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete venue');
        return response.ok; 
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['venues']); 
      },
    });
  };  




  export {
    fetchVenuesBatch,
    useCreateVenue,
    useFetchVenueById,
    useFetchManagedVenues, 
    useUpdateVenue,
    useDeleteVenue,
  };