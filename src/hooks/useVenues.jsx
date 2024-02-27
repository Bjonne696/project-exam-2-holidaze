// src/hooks/useVenues.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore';

// Fetch venues
async function fetchVenues({ queryKey }) {
  const [_key, { limit, offset }] = queryKey;
  const response = await fetch(`${BASE_URL}/venues?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

// Function to fetch a venue by id
const fetchVenueById = async ({ queryKey }) => {
  const [_key, { id }] = queryKey;
  const response = await fetch(`${BASE_URL}/venues/${id}`);
  if (!response.ok) throw new Error('Failed to fetch venue');
  return response.json();
};

// Function to fetch managed venues
async function fetchManagedVenues() {
  // Access the user's information from the Zustand store
  const { user, token } = useAuthStore.getState();

  // Ensure that both the user's name and token are available
  if (!user?.name || !token) {
    console.error("User's name or token is missing.");
    throw new Error("Authentication information is missing.");
  }

  const headers = { 'Authorization': `Bearer ${token}` };
  try {
    const response = await fetch(`${BASE_URL}/profiles/${user.name}/venues`, { headers });
    if (!response.ok) throw new Error('Failed to fetch managed venues');
    return response.json();
  } catch (error) {
    console.error("Error fetching managed venues:", error.message);
    throw error; // Rethrow to handle it further up the call chain
  }
}

// Function to Create venue
async function createVenue(venueData, { token }) {
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
}



// Function to update a venue
async function updateVenue({ venueId, venueData }) {
  const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(venueData),
  });
  if (!response.ok) throw new Error('Failed to update venue');
  return response.json();
}

// Function to delete a venue
async function deleteVenue(venueId) {
  const response = await fetch(`${BASE_URL}/venues/${venueId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete venue');
  return response.json(); // Or return true/false based on your API
}


// Custom hook for fetching venues
export function useFetchVenues(limit = 100, offset = 0) {
  return useQuery({
    queryKey: ['venues', { limit, offset }],
    queryFn: fetchVenues,
  });
}


// Custom hook for fetching venues by id
export const useFetchVenueById = (id) => {
  return useQuery({
    queryKey: ['venue', { id }],
    queryFn: fetchVenueById,
    options: {
      keepPreviousData: true,
    },
  });
};


// Custom hook for fetching managed venues
export function useFetchManagedVenues(profileName, token) {
  return useQuery({
    queryKey: ['managedVenues', { profileName, token }],
    queryFn: fetchManagedVenues,
    options: {
      refetchOnWindowFocus: false,
    },
  });
}


// Custom hook for creating a venue
export function useCreateVenue() {
  const queryClient = useQueryClient();
  const { token } = useAuthStore((state) => state);

  return useMutation({
    mutationFn: (venueData) => createVenue(venueData, { token }),
    onSuccess: () => {
      queryClient.invalidateQueries(['venues']);
    },
  });
}


// Custom hook for updating a venue
export function useUpdateVenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVenue,
    onSuccess: () => {
      // Invalidate and refetch venues to reflect the update
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}


// Custom hook for deleting a venue
export function useDeleteVenue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVenue,
    onSuccess: () => {
      // Invalidate and refetch venues to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
  });
}



