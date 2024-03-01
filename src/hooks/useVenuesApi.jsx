// project-exam-2-holidaze/src/hooks/useVenuesApi.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore'; 

// Assuming fetch functions similar to those in venuesStore are defined here

const fetchVenues = async (offset = 0, limit = 100) => {
  const response = await fetch(`${BASE_URL}/venues?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      // If your API requires authorization, include the token in the request headers
      'Authorization': `Bearer ${useAuthStore.getState().token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch venues');
  return response.json();
};

const useFetchVenues = () => {
  const [offset, setOffset] = useState(0);
  const [allVenues, setAllVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVenues = async () => {
      try {
        setIsLoading(true);
        let venues = [];
        let hasMore = true;
        
        while (hasMore) {
          const newVenues = await fetchVenues(offset);
          venues = [...venues, ...newVenues];
          setOffset(offset + newVenues.length);
          hasMore = newVenues.length > 0;
          if (!hasMore) break; // Exit loop if an empty array is received
        }

        setAllVenues(venues);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVenues();
  }, []); // Empty dependency array ensures this runs once on mount

  return { data: allVenues, isLoading, error };
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
const useFetchVenueById = (venueId) => {
    return useQuery({
      queryKey: ['venue', venueId],
      queryFn: async () => {
        const response = await fetch(`${BASE_URL}/venues/${venueId}`);
        if (!response.ok) throw new Error('Failed to fetch venue');
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

  export {
    useFetchVenues,
    useCreateVenue,
    useFetchVenueById,
    useFetchManagedVenues,  // Corrected export
    useUpdateVenue,
    useDeleteVenue
  };