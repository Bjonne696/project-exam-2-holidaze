// src/hooks/useBookingsApi.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import BASE_URL from '../constants/api';
import useAuthStore from '../stores/authStore';

// Function to fetch bookings for a specific venue
const fetchBookingsForVenue = async (venueId, token) => {
  const response = await fetch(`${BASE_URL}/venues/${venueId}?_bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch bookings for the venue');
  return response.json();
};

// Function to fetch bookings for a user
const fetchUserBookings = async (userName, token) => {
  const response = await fetch(`${BASE_URL}/profiles/${userName}/bookings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorMsg = await response.json();
    throw new Error(errorMsg.message || "Failed to fetch user bookings");
  }
  return response.json();
};

// Function to create a booking
const createBooking = async (bookingData, token) => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Ensure the token is correctly included in the authorization header
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
};

// Function to update a booking
const updateBooking = async (bookingId, updateData, token) => {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    if (!response.ok) throw new Error('Failed to update booking');
    return response.json();
  };

// Function to delete a booking
const deleteBooking = async (bookingId, token) => {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete booking');
    return response.ok; // Return true as indication of success
  };


// ********************************************************************************************************************
//                          '''''''''''''''''''''HOOKS'''''''''''''''''''''''''
// ********************************************************************************************************************

export const useFetchBookingsForVenue = ({ venueId, token }) => {
  return useQuery({
    queryKey: ['bookingsForVenue', venueId],
    queryFn: () => fetchBookingsForVenue(venueId, token),
    enabled: !!venueId && !!token,
  });
};

export const useFetchUserBookings = ({ userName, token }) => {
  return useQuery({
    queryKey: ['userBookings', userName],
    queryFn: () => fetchUserBookings(userName, token),
    enabled: !!userName && !!token,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token); // Correctly accessing the token from Zustand store

  // Ensure the useMutation hook is correctly called within the custom hook body
  return useMutation({
    mutationFn: (newBooking) => {
      // The fetch call must be within the mutationFn callback
      return fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use token from Zustand store
        },
        body: JSON.stringify(newBooking),
      })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to create booking');
        return response.json();
      });
    },
    onSuccess: () => {
      // Invalidate and refetch queries as needed
      queryClient.invalidateQueries(['bookingsForVenue']);
      queryClient.invalidateQueries(['userBookings']);
    },
  });
};


export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token'); // or retrieve it from your auth state/store

  return useMutation({
    mutationFn: ({ bookingId, updateData }) => updateBooking(bookingId, updateData, token),
    onSuccess: () => {
      // Here you should specify the exact queries to be invalidated
      queryClient.invalidateQueries({ queryKey: ['bookingsForVenue'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
};
// React Query Hook for deleting a booking
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token'); // or retrieve it from your auth state/store

  return useMutation({
    mutationFn: (bookingId) => deleteBooking(bookingId, token),
    onSuccess: () => {
      // Invalidate specific queries to refresh data as needed
      queryClient.invalidateQueries({ queryKey: ['bookingsForVenue'] });
      queryClient.invalidateQueries({ queryKey: ['userBookings'] });
    },
  });
};

export { fetchBookingsForVenue, fetchUserBookings, createBooking, updateBooking, deleteBooking}


