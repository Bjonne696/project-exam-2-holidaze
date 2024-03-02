// project-exam-2-holidaze/src/hooks/useVenuesApi.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore'; 

// Assuming fetch functions similar to those in venuesStore are defined here

const fetchVenuesBatch = async (offset, limit = 100) => {
  try {
    const token = useAuthStore.getState().token; // Get token if needed
    const response = await fetch(`${BASE_URL}/venues?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the Authorization header if your API requires it
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
    throw error; // Rethrow error to be handled by the caller
  }
};


const useCreateVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (venueData) => {
      const token = localStorage.getItem('token'); // Retrieve the auth token
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




// Fetch a single venue by ID
// Adjusted to fetch a single venue by ID including its bookings
const useFetchVenueById = (venueId) => {
  return useQuery({
    queryKey: ['venue', venueId, 'withBookings'],
    queryFn: async () => {
      // Updated to include the _bookings query parameter
      const response = await fetch(`${BASE_URL}/venues/${venueId}?_bookings=true`);
      if (!response.ok) throw new Error('Failed to fetch venue with bookings');
      return response.json();
    },
    enabled: !!venueId, // Only run the query if venueId is truthy
  });
};


// Fetch venues managed by a manager
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
    enabled: !!name && !!token, // Only run the query if name and token are truthy
  });
};
  
  // Update a venue
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
        // Optionally, you can refetch relevant queries or invalidate specific cache keys
        queryClient.invalidateQueries('venues'); // Replace 'venues' with your actual query key
      },
    });
  };
  
  // Delete a venue
   const useDeleteVenue = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (venueId) => {
        const token = localStorage.getItem('token'); // Retrieve the auth token
        const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete venue');
        return response.ok; // Return true as indication of success
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['venues']); // Refresh the list of venues
      },
    });
  };  

  // Fetch bookings for a specific venue MAYBE BE IN ANOTHER FILE: useBookingsApi.jsx


  export {
    fetchVenuesBatch,
    useCreateVenue,
    useFetchVenueById,
    useFetchManagedVenues,  // Corrected export
    useUpdateVenue,
    useDeleteVenue,
  };